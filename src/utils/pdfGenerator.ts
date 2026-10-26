import { jsPDF } from 'jspdf';
import { MedicalRecordItem } from '../components/EncryptedVaultSection';
import { AppointmentItem } from '../components/TelemedicineSection';

export interface PdfVitalItem {
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
}

export interface PdfMedicationItem {
  id: string;
  medicineName: string;
  dosage: string;
  scheduleTime: string;
  frequency: string;
  takenToday: boolean;
}

export interface PdfVaccineItem {
  id: string;
  vaccineName: string;
  doseNumber: number;
  status: string;
  scheduledDate: string;
  clinicName: string;
}

export interface PdfPatientProfile {
  displayName: string;
  contactNumber: string;
  age: number;
  bloodGroup: string;
}

export interface PdfExportOptions {
  includeVitals: boolean;
  includeMedications: boolean;
  includeAppointments: boolean;
  includeVaccinations: boolean;
  includeVaultRecords: boolean;
  doctorNotes: string;
}

export interface PdfSummaryData {
  profile: PdfPatientProfile;
  vitals: PdfVitalItem[];
  medications: PdfMedicationItem[];
  appointments: AppointmentItem[];
  vaccines: PdfVaccineItem[];
  decryptedVaultRecords: Array<{
    record: MedicalRecordItem;
    plainText: string;
  }>;
  options: PdfExportOptions;
}

/**
 * Helper to render Unicode text (such as Hindi/Marathi Devanagari script)
 * safely into jsPDF. If the string is pure ASCII, uses native vector jsPDF text.
 * If the string contains non-ASCII characters (e.g. Devanagari), renders a high-DPI
 * offscreen canvas image so characters never garble in standard PDF viewers.
 */
function drawSafeText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  opts?: {
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
    color?: [number, number, number];
    maxWidthMm?: number;
  }
) {
  const safeStr = (text || '-').trim() || '-';
  const fontSize = opts?.fontSize ?? 9.5;
  const fontWeight = opts?.fontWeight ?? 'normal';
  const color = opts?.color ?? [15, 23, 42];

  // Pure ASCII fast path (crisp vector text)
  if (/^[\x00-\x7F]*$/.test(safeStr)) {
    doc.setFont('helvetica', fontWeight);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    if (opts?.maxWidthMm) {
      const lines = doc.splitTextToSize(safeStr, opts.maxWidthMm);
      doc.text(lines[0] || safeStr, x, y);
    } else {
      doc.text(safeStr, x, y);
    }
    return;
  }

  // Non-ASCII / Devanagari high-DPI canvas image path
  try {
    const canvas = document.createElement('canvas');
    const scale = 3;
    const pxFontSize = Math.round(fontSize * 1.45);
    const maxWidthPx = Math.round((opts?.maxWidthMm ?? 85) * 3.78);

    canvas.width = maxWidthPx * scale;
    canvas.height = Math.round(pxFontSize * 1.9) * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      doc.text(safeStr.replace(/[^\x00-\x7F]/g, '?'), x, y);
      return;
    }

    ctx.scale(scale, scale);
    ctx.font = `${fontWeight === 'bold' ? '600' : '400'} ${pxFontSize}px "Inter", "Noto Sans Devanagari", system-ui, sans-serif`;
    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(safeStr, 0, Math.round(pxFontSize * 1.25), maxWidthPx - 4);

    const dataUrl = canvas.toDataURL('image/png');
    const widthMm = opts?.maxWidthMm ?? 85;
    const heightMm = (canvas.height / scale) / 3.78;
    doc.addImage(dataUrl, 'PNG', x, y - heightMm * 0.72, widthMm, heightMm);
  } catch {
    doc.setFont('helvetica', fontWeight);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(safeStr.replace(/[^\x00-\x7F]/g, ''), x, y);
  }
}

export function generateDoctorHealthSummaryPdf(data: PdfSummaryData): string {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > pageHeight - 18) {
      doc.addPage();
      y = 16;
      // Subtle top continuation header
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(
        'PREVENTIA CLINICAL HEALTH SUMMARY — CONTINUATION SHEET',
        margin,
        10
      );
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 12, pageWidth - margin, 12);
      y = 18;
    }
  };

  // 1. TOP CLINICAL HEADER BANNER
  doc.setFillColor(15, 118, 110); // Teal-700
  doc.roundedRect(margin, y, contentWidth, 24, 2.5, 2.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text('PREVENTIA — CLINICAL HEALTH & MEDICATION SUMMARY', margin + 5, y + 9.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(204, 251, 241);
  const generatedStamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  doc.text(
    `Physician-Ready Patient Health Dossier  |  Generated: ${generatedStamp}  |  AES-256 Verified`,
    margin + 5,
    y + 16
  );
  doc.text(
    'Includes Vitals History, Medication Adherence, Doctor Appointments & Medical Vault Records',
    margin + 5,
    y + 21
  );

  y += 28;

  // 2. PATIENT DEMOGRAPHICS & CLINICAL SNAPSHOT BOX
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('PATIENT FULL NAME:', margin + 4, y + 6.5);
  drawSafeText(doc, data.profile.displayName || 'Community Member', margin + 40, y + 6.5, {
    fontSize: 10,
    fontWeight: 'bold',
    color: [15, 23, 42],
    maxWidthMm: 58,
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('CONTACT NUMBER:', margin + 4, y + 13.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(data.profile.contactNumber || 'Not Provided', margin + 40, y + 13.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('AGE / BLOOD GROUP:', margin + 108, y + 6.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 118, 110);
  doc.text(
    `${data.profile.age} Years  |  Blood Group: ${data.profile.bloodGroup || 'O+'}`,
    margin + 144,
    y + 6.5
  );

  // Compute averages from vitals
  const avgSys =
    data.vitals.length > 0
      ? Math.round(data.vitals.reduce((acc, v) => acc + v.systolic, 0) / data.vitals.length)
      : 0;
  const avgDia =
    data.vitals.length > 0
      ? Math.round(data.vitals.reduce((acc, v) => acc + v.diastolic, 0) / data.vitals.length)
      : 0;
  const avgSugar =
    data.vitals.length > 0
      ? Math.round(data.vitals.reduce((acc, v) => acc + v.bloodSugar, 0) / data.vitals.length)
      : 0;
  const avgHr =
    data.vitals.length > 0
      ? Math.round(data.vitals.reduce((acc, v) => acc + v.heartRate, 0) / data.vitals.length)
      : 0;
  const takenCount = data.medications.filter((m) => m.takenToday).length;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('MEAN VITALS:', margin + 108, y + 13.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(
    data.vitals.length > 0
      ? `BP ${avgSys}/${avgDia} mmHg · Sugar ${avgSugar} mg/dL · HR ${avgHr} bpm`
      : 'No vitals logged',
    margin + 132,
    y + 13.5
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('SUMMARY COUNTS:', margin + 4, y + 20.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `${data.vitals.length} Vital Logs  |  ${takenCount}/${data.medications.length} Daily Meds Taken  |  ${data.appointments.length} Appointments  |  ${data.vaccines.length} Vaccines`,
    margin + 40,
    y + 20.5
  );

  y += 30;

  // Helper to draw a section title bar
  const drawSectionHeader = (title: string, subtitle?: string) => {
    ensureSpace(16);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, y, contentWidth, 8, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 118, 110);
    doc.text(title, margin + 3, y + 5.5);
    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(subtitle, pageWidth - margin - 3, y + 5.5, { align: 'right' });
    }
    y += 11;
  };

  // 3. OPTIONAL PATIENT NOTES / QUESTIONS FOR DOCTOR
  if (data.options.doctorNotes.trim()) {
    drawSectionHeader(
      'PATIENT NOTES & SYMPTOMS FOR ATTENDING PHYSICIAN',
      'Patient-Reported Context'
    );
    ensureSpace(16);
    doc.setFillColor(254, 252, 232);
    doc.setDrawColor(253, 224, 71);
    doc.roundedRect(margin, y - 1, contentWidth, 12, 1.5, 1.5, 'FD');
    drawSafeText(doc, data.options.doctorNotes.trim(), margin + 3, y + 6, {
      fontSize: 9,
      color: [113, 63, 18],
      maxWidthMm: contentWidth - 6,
    });
    y += 15;
  }

  // 4. SECTION: DAILY VITALS & SLEEP LOGS
  if (data.options.includeVitals) {
    drawSectionHeader(
      '1. DAILY VITALS, BLOOD SUGAR & SLEEP HISTORY',
      `Showing ${Math.min(data.vitals.length, 15)} recent entries`
    );

    if (data.vitals.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('No vital logs recorded yet.', margin + 2, y + 4);
      y += 10;
    } else {
      // Table Header
      ensureSpace(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('DATE', margin + 2, y);
      doc.text('BP (mmHg)', margin + 28, y);
      doc.text('PULSE', margin + 54, y);
      doc.text('SUGAR (mg/dL)', margin + 74, y);
      doc.text('SLEEP & WATER', margin + 104, y);
      doc.text('PATIENT NOTES', margin + 138, y);
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y + 2, pageWidth - margin, y + 2);
      y += 6.5;

      data.vitals.slice(0, 15).forEach((v, idx) => {
        ensureSpace(8);
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y - 4.5, contentWidth, 6.5, 'F');
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(v.date, margin + 2, y);

        // Highlight elevated BP
        const bpHigh = v.systolic >= 140 || v.diastolic >= 90;
        doc.setFont('helvetica', bpHigh ? 'bold' : 'normal');
        if (bpHigh) doc.setTextColor(185, 28, 28);
        else doc.setTextColor(15, 23, 42);
        doc.text(`${v.systolic}/${v.diastolic}`, margin + 28, y);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(`${v.heartRate} bpm`, margin + 54, y);

        const sugarHigh = v.bloodSugar >= 126;
        doc.setFont('helvetica', sugarHigh ? 'bold' : 'normal');
        if (sugarHigh) doc.setTextColor(180, 83, 9);
        else doc.setTextColor(15, 23, 42);
        doc.text(`${v.bloodSugar} mg/dL`, margin + 74, y);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(`${v.sleepHours}h (${v.sleepQuality}) · ${v.waterGlasses} gl`, margin + 104, y);

        drawSafeText(doc, v.notes || '-', margin + 138, y, {
          fontSize: 8,
          color: [71, 85, 105],
          maxWidthMm: 42,
        });
        y += 6.5;
      });
      y += 4;
    }
  }

  // 5. SECTION: MEDICATION REGIMEN & ADHERENCE HISTORY
  if (data.options.includeMedications) {
    drawSectionHeader(
      '2. ACTIVE MEDICATION REGIMEN & DAILY ADHERENCE',
      `${takenCount} of ${data.medications.length} taken today`
    );

    if (data.medications.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('No active medications listed.', margin + 2, y + 4);
      y += 10;
    } else {
      ensureSpace(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('MEDICINE NAME', margin + 2, y);
      doc.text('DOSAGE & INSTRUCTIONS', margin + 68, y);
      doc.text('SCHEDULE TIME', margin + 124, y);
      doc.text('TODAY STATUS', margin + 156, y);
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y + 2, pageWidth - margin, y + 2);
      y += 6.5;

      data.medications.forEach((med, idx) => {
        ensureSpace(8);
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y - 4.5, contentWidth, 6.5, 'F');
        }
        drawSafeText(doc, med.medicineName, margin + 2, y, {
          fontSize: 8.5,
          fontWeight: 'bold',
          color: [15, 23, 42],
          maxWidthMm: 62,
        });
        drawSafeText(doc, `${med.dosage} (${med.frequency})`, margin + 68, y, {
          fontSize: 8.5,
          color: [51, 65, 85],
          maxWidthMm: 52,
        });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(med.scheduleTime, margin + 124, y);

        doc.setFont('helvetica', 'bold');
        if (med.takenToday) {
          doc.setTextColor(21, 128, 61);
          doc.text('TAKEN', margin + 156, y);
        } else {
          doc.setTextColor(180, 83, 9);
          doc.text('PENDING', margin + 156, y);
        }
        y += 6.5;
      });
      y += 4;
    }
  }

  // 6. SECTION: DOCTOR APPOINTMENTS & CONSULTATION HISTORY
  if (data.options.includeAppointments) {
    drawSectionHeader(
      '3. DOCTOR APPOINTMENTS & TELEMEDICINE CONSULTATIONS',
      `${data.appointments.length} total records`
    );

    if (data.appointments.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('No doctor appointments recorded.', margin + 2, y + 4);
      y += 10;
    } else {
      ensureSpace(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('DATE & TIME', margin + 2, y);
      doc.text('DOCTOR & SPECIALTY', margin + 36, y);
      doc.text('MODE', margin + 94, y);
      doc.text('CLINICAL REASON', margin + 116, y);
      doc.text('STATUS', margin + 162, y);
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y + 2, pageWidth - margin, y + 2);
      y += 6.5;

      data.appointments.forEach((appt, idx) => {
        ensureSpace(8);
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y - 4.5, contentWidth, 6.5, 'F');
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(15, 23, 42);
        doc.text(`${appt.appointmentDate} ${appt.appointmentTime}`, margin + 2, y);

        drawSafeText(doc, `${appt.doctorName} (${appt.specialty})`, margin + 36, y, {
          fontSize: 8.5,
          fontWeight: 'bold',
          color: [15, 23, 42],
          maxWidthMm: 55,
        });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        doc.text(appt.consultType, margin + 94, y);

        drawSafeText(doc, appt.reason, margin + 116, y, {
          fontSize: 8,
          color: [71, 85, 105],
          maxWidthMm: 43,
        });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        if (appt.status === 'Completed') doc.setTextColor(21, 128, 61);
        else if (appt.status === 'Cancelled') doc.setTextColor(185, 28, 28);
        else doc.setTextColor(15, 118, 110);
        doc.text(appt.status.toUpperCase(), margin + 162, y);
        y += 6.5;
      });
      y += 4;
    }
  }

  // 7. SECTION: VACCINATION & IMMUNIZATION SCHEDULE
  if (data.options.includeVaccinations) {
    drawSectionHeader(
      '4. VACCINATION & IMMUNIZATION HISTORY',
      `${data.vaccines.length} immunization entries`
    );

    if (data.vaccines.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('No vaccination records logged.', margin + 2, y + 4);
      y += 10;
    } else {
      ensureSpace(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('VACCINE NAME', margin + 2, y);
      doc.text('DOSE', margin + 74, y);
      doc.text('DATE', margin + 92, y);
      doc.text('CLINIC / HOSPITAL', margin + 118, y);
      doc.text('STATUS', margin + 162, y);
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y + 2, pageWidth - margin, y + 2);
      y += 6.5;

      data.vaccines.forEach((vac, idx) => {
        ensureSpace(8);
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y - 4.5, contentWidth, 6.5, 'F');
        }
        drawSafeText(doc, vac.vaccineName, margin + 2, y, {
          fontSize: 8.5,
          fontWeight: 'bold',
          color: [15, 23, 42],
          maxWidthMm: 68,
        });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`#${vac.doseNumber}`, margin + 74, y);
        doc.text(vac.scheduledDate, margin + 92, y);

        drawSafeText(doc, vac.clinicName, margin + 118, y, {
          fontSize: 8,
          color: [71, 85, 105],
          maxWidthMm: 40,
        });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        if (vac.status === 'Completed') doc.setTextColor(21, 128, 61);
        else doc.setTextColor(180, 83, 9);
        doc.text(vac.status.toUpperCase(), margin + 162, y);
        y += 6.5;
      });
      y += 4;
    }
  }

  // 8. SECTION: DECRYPTED AES-256 MEDICAL VAULT RECORDS
  if (data.options.includeVaultRecords) {
    drawSectionHeader(
      '5. DECRYPTED MEDICAL VAULT RECORDS (LAB REPORTS & PRESCRIPTIONS)',
      `${data.decryptedVaultRecords.length} unlocked records`
    );

    if (data.decryptedVaultRecords.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        'No unlocked vault records included (verify Encryption PIN to decrypt and attach records).',
        margin + 2,
        y + 4
      );
      y += 10;
    } else {
      data.decryptedVaultRecords.forEach(({ record, plainText }) => {
        ensureSpace(20);
        doc.setFillColor(240, 253, 250);
        doc.setDrawColor(153, 246, 228);
        doc.roundedRect(margin, y - 3, contentWidth, 16, 1.5, 1.5, 'FD');

        drawSafeText(
          doc,
          `${record.title}  [${record.category} — ${record.recordDate}]`,
          margin + 3,
          y + 2,
          {
            fontSize: 9,
            fontWeight: 'bold',
            color: [17, 94, 89],
            maxWidthMm: contentWidth - 8,
          }
        );

        drawSafeText(doc, plainText, margin + 3, y + 9, {
          fontSize: 8.5,
          color: [15, 23, 42],
          maxWidthMm: contentWidth - 8,
        });
        y += 19;
      });
    }
  }

  // 9. CLINICAL FOOTER & ATTENDING DOCTOR SIGNATURE BLOCK
  ensureSpace(24);
  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('ATTENDING PHYSICIAN REMARKS / NEXT FOLLOW-UP DATE:', margin, y);
  doc.text('DOCTOR SIGNATURE / STAMP:', pageWidth - margin - 55, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Generated locally in patient browser via Preventia Zero-Knowledge Medical Vault. For clinical reference during consultation.',
    margin,
    pageHeight - 10
  );

  const sanitizedName = (data.profile.displayName || 'Patient')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  const datePart = new Date().toISOString().slice(0, 10);
  const fileName = `Preventia_Doctor_Summary_${sanitizedName || 'Patient'}_${datePart}.pdf`;

  doc.save(fileName);
  return fileName;
}

export interface DoctorPortalPatientPdfInput {
  doctorName: string;
  doctorSpecialty: string;
  doctorClinic: string;
  doctorPhone: string;
  registrationId: string;
  patient: {
    name: string;
    age: number;
    bloodGroup: string;
    contactPhone: string;
    triageStatus: string;
    chiefComplaint: string;
    lastVisitDate: string;
    vitalsHistory: Array<{
      id: string;
      date: string;
      systolic: number;
      diastolic: number;
      heartRate: number;
      bloodSugar: number;
      sleepHours: number;
      sleepQuality: string;
      notes: string;
    }>;
    medications: Array<{
      id: string;
      medicineName: string;
      dosage: string;
      scheduleTime: string;
      frequency: string;
      takenToday: boolean;
    }>;
    vaccines: Array<{
      id: string;
      vaccineName: string;
      doseNumber: number;
      status: string;
      scheduledDate: string;
      clinicName: string;
    }>;
    reports: Array<{
      id: string;
      title: string;
      category: string;
      recordDate: string;
      summary: string;
    }>;
  };
  bpStabilityLabel: string;
  glucoseStabilityLabel: string;
  issuedPrescriptions: Array<{
    id: string;
    patientName: string;
    medicineName: string;
    dosage: string;
    scheduleTime: string;
    frequency: string;
    durationDays: string;
    instructions: string;
    issuedAt: string;
  }>;
  clinicalNotes: Array<{
    id: string;
    patientName: string;
    chiefComplaint: string;
    clinicalAssessment: string;
    followUpDate: string;
    followUpTriggerAction: string;
    loggedAt: string;
  }>;
  includeSections?: {
    vitalsAndTrends: boolean;
    medicationsAndRx: boolean;
    reportsAndNotes: boolean;
    immunizations: boolean;
  };
}

export function generateDoctorPortalPatientPdf(input: DoctorPortalPatientPdfInput): string {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const sections = input.includeSections ?? {
    vitalsAndTrends: true,
    medicationsAndRx: true,
    reportsAndNotes: true,
    immunizations: true,
  };

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 14;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > pageHeight - 18) {
      doc.addPage();
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `PREVENTIA DOCTOR'S PORTAL — OFFLINE CLINICAL PATIENT RECORD (${input.patient.name})`,
        margin,
        10
      );
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 12, pageWidth - margin, 12);
      y = 18;
    }
  };

  const drawSectionHeader = (title: string, subtitle?: string) => {
    ensureSpace(15);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, y, contentWidth, 8, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 118, 110);
    doc.text(title, margin + 3, y + 5.5);
    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(subtitle, pageWidth - margin - 3, y + 5.5, { align: 'right' });
    }
    y += 11;
  };

  // 1. TOP CLINICAL HEADER BANNER
  doc.setFillColor(15, 118, 110);
  doc.roundedRect(margin, y, contentWidth, 25, 2.5, 2.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('PREVENTIA — OFFLINE CLINICAL PATIENT HEALTH RECORD', margin + 5, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(204, 251, 241);
  const generatedStamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  drawSafeText(
    doc,
    `Attending Physician: ${input.doctorName} (${input.doctorSpecialty})  |  Reg: ${input.registrationId}`,
    margin + 5,
    y + 15.5,
    {
      fontSize: 8.5,
      color: [204, 251, 241],
      maxWidthMm: contentWidth - 10,
    }
  );
  drawSafeText(
    doc,
    `Clinic: ${input.doctorClinic} (${input.doctorPhone})  |  Exported: ${generatedStamp}`,
    margin + 5,
    y + 21,
    {
      fontSize: 8,
      color: [204, 251, 241],
      maxWidthMm: contentWidth - 10,
    }
  );

  y += 29;

  // 2. PATIENT DEMOGRAPHICS, TRIAGE & TREND STABILITY SUMMARY
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('PATIENT NAME:', margin + 4, y + 6.5);
  drawSafeText(doc, input.patient.name, margin + 34, y + 6.5, {
    fontSize: 10,
    fontWeight: 'bold',
    color: [15, 23, 42],
    maxWidthMm: 65,
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('AGE / BLOOD / PHONE:', margin + 104, y + 6.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 118, 110);
  doc.text(
    `${input.patient.age} yrs  |  ${input.patient.bloodGroup}  |  ${input.patient.contactPhone}`,
    margin + 142,
    y + 6.5
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('TRIAGE & COMPLAINT:', margin + 4, y + 13.5);
  drawSafeText(
    doc,
    `[${input.patient.triageStatus.toUpperCase()}] ${input.patient.chiefComplaint}`,
    margin + 40,
    y + 13.5,
    {
      fontSize: 8.5,
      fontWeight: 'bold',
      color: input.patient.triageStatus === 'Urgent' ? [185, 28, 28] : [15, 23, 42],
      maxWidthMm: contentWidth - 44,
    }
  );

  const vitals = input.patient.vitalsHistory;
  const avgSys =
    vitals.length > 0
      ? Math.round(vitals.reduce((acc, v) => acc + v.systolic, 0) / vitals.length)
      : 0;
  const avgDia =
    vitals.length > 0
      ? Math.round(vitals.reduce((acc, v) => acc + v.diastolic, 0) / vitals.length)
      : 0;
  const avgSugar =
    vitals.length > 0
      ? Math.round(vitals.reduce((acc, v) => acc + v.bloodSugar, 0) / vitals.length)
      : 0;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('BP STABILITY:', margin + 4, y + 20.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Mean ${avgSys}/${avgDia} mmHg (${input.bpStabilityLabel})`, margin + 34, y + 20.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('GLUCOSE STABILITY:', margin + 104, y + 20.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(
    `Mean ${avgSugar} mg/dL (${input.glucoseStabilityLabel})`,
    margin + 138,
    y + 20.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Last Synced Visit: ${input.patient.lastVisitDate}  |  Vitals Logged: ${vitals.length}  |  Active Medications: ${input.patient.medications.length}  |  Lab Reports: ${input.patient.reports.length}`,
    margin + 4,
    y + 26
  );

  y += 33;

  // 3. VITALS & LONGITUDINAL STABILITY LOGS
  if (sections.vitalsAndTrends) {
    drawSectionHeader(
      '1. LOGGED VITALS & BLOOD PRESSURE / GLUCOSE STABILITY HISTORY',
      `${vitals.length} longitudinal entries`
    );

    if (vitals.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('No vitals logged for this patient.', margin + 2, y + 4);
      y += 9;
    } else {
      ensureSpace(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('DATE', margin + 2, y);
      doc.text('BP (mmHg)', margin + 28, y);
      doc.text('FASTING GLUCOSE', margin + 56, y);
      doc.text('HEART RATE', margin + 90, y);
      doc.text('SLEEP', margin + 116, y);
      doc.text('CLINICAL / PATIENT NOTES', margin + 140, y);
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y + 2, pageWidth - margin, y + 2);
      y += 6.5;

      vitals.forEach((v, idx) => {
        ensureSpace(8);
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y - 4.5, contentWidth, 6.5, 'F');
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(v.date, margin + 2, y);

        const bpHigh = v.systolic >= 140 || v.diastolic >= 90;
        doc.setFont('helvetica', bpHigh ? 'bold' : 'normal');
        if (bpHigh) doc.setTextColor(185, 28, 28);
        else doc.setTextColor(15, 23, 42);
        doc.text(`${v.systolic}/${v.diastolic} mmHg`, margin + 28, y);

        const sugarHigh = v.bloodSugar >= 126;
        doc.setFont('helvetica', sugarHigh ? 'bold' : 'normal');
        if (sugarHigh) doc.setTextColor(180, 83, 9);
        else doc.setTextColor(15, 23, 42);
        doc.text(`${v.bloodSugar} mg/dL`, margin + 56, y);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(`${v.heartRate} bpm`, margin + 90, y);
        doc.text(`${v.sleepHours}h (${v.sleepQuality})`, margin + 116, y);

        drawSafeText(doc, v.notes || '-', margin + 140, y, {
          fontSize: 8,
          color: [71, 85, 105],
          maxWidthMm: 40,
        });
        y += 6.5;
      });
      y += 4;
    }
  }

  // 4. ACTIVE MEDICATIONS & DIGITAL E-PRESCRIPTIONS
  if (sections.medicationsAndRx) {
    const takenCount = input.patient.medications.filter((m) => m.takenToday).length;
    drawSectionHeader(
      '2. ACTIVE MEDICATIONS & DIGITAL E-PRESCRIPTIONS',
      `${takenCount}/${input.patient.medications.length} taken today`
    );

    if (input.patient.medications.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('No active medications recorded.', margin + 2, y + 4);
      y += 9;
    } else {
      ensureSpace(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text('MEDICINE NAME', margin + 2, y);
      doc.text('DOSAGE & FREQUENCY', margin + 68, y);
      doc.text('SCHEDULE TIME', margin + 126, y);
      doc.text('ADHERENCE', margin + 156, y);
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y + 2, pageWidth - margin, y + 2);
      y += 6.5;

      input.patient.medications.forEach((med, idx) => {
        ensureSpace(8);
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(margin, y - 4.5, contentWidth, 6.5, 'F');
        }
        drawSafeText(doc, med.medicineName, margin + 2, y, {
          fontSize: 8.5,
          fontWeight: 'bold',
          color: [15, 23, 42],
          maxWidthMm: 62,
        });
        drawSafeText(doc, `${med.dosage} · ${med.frequency}`, margin + 68, y, {
          fontSize: 8.5,
          color: [51, 65, 85],
          maxWidthMm: 54,
        });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(med.scheduleTime, margin + 126, y);

        doc.setFont('helvetica', 'bold');
        if (med.takenToday) {
          doc.setTextColor(21, 128, 61);
          doc.text('TAKEN TODAY', margin + 156, y);
        } else {
          doc.setTextColor(180, 83, 9);
          doc.text('PENDING', margin + 156, y);
        }
        y += 6.5;
      });
      y += 4;
    }

    const patientRx = input.issuedPrescriptions.filter(
      (rx) => rx.patientName.toLowerCase() === input.patient.name.toLowerCase()
    );
    if (patientRx.length > 0) {
      ensureSpace(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 118, 110);
      doc.text('SIGNED DIGITAL E-PRESCRIPTIONS ISSUED FOR PATIENT:', margin + 2, y + 2);
      y += 6;
      patientRx.forEach((rx) => {
        ensureSpace(12);
        doc.setFillColor(240, 253, 250);
        doc.setDrawColor(153, 246, 228);
        doc.roundedRect(margin, y - 3.5, contentWidth, 11, 1.5, 1.5, 'FD');
        drawSafeText(
          doc,
          `Rx: ${rx.medicineName} (${rx.dosage}) · ${rx.scheduleTime} · ${rx.frequency} for ${rx.durationDays}`,
          margin + 3,
          y + 1,
          { fontSize: 8.5, fontWeight: 'bold', color: [15, 23, 42], maxWidthMm: contentWidth - 6 }
        );
        drawSafeText(
          doc,
          `Instructions: ${rx.instructions}  [Issued: ${rx.issuedAt}]`,
          margin + 3,
          y + 5.5,
          { fontSize: 8, color: [51, 65, 85], maxWidthMm: contentWidth - 6 }
        );
        y += 13;
      });
    }
  }

  // 5. UPLOADED HEALTH REPORTS & CLINICAL NOTES
  if (sections.reportsAndNotes) {
    drawSectionHeader(
      '3. UPLOADED HEALTH RECORDS, LAB REPORTS & CLINICAL NOTES',
      `${input.patient.reports.length} lab reports`
    );

    if (input.patient.reports.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('No lab reports uploaded.', margin + 2, y + 4);
      y += 9;
    } else {
      input.patient.reports.forEach((rep) => {
        ensureSpace(15);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(margin, y - 3, contentWidth, 13, 1.5, 1.5, 'FD');
        drawSafeText(
          doc,
          `${rep.title}  [${rep.category} · ${rep.recordDate}]`,
          margin + 3,
          y + 1.5,
          { fontSize: 8.5, fontWeight: 'bold', color: [15, 23, 42], maxWidthMm: contentWidth - 6 }
        );
        drawSafeText(doc, rep.summary, margin + 3, y + 6.5, {
          fontSize: 8,
          color: [71, 85, 105],
          maxWidthMm: contentWidth - 6,
        });
        y += 15;
      });
    }

    const patientNotes = input.clinicalNotes.filter(
      (cn) => cn.patientName.toLowerCase() === input.patient.name.toLowerCase()
    );
    if (patientNotes.length > 0) {
      ensureSpace(14);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 118, 110);
      doc.text('DOCTOR CLINICAL NOTES & FOLLOW-UP TRIGGERS:', margin + 2, y + 2);
      y += 6;
      patientNotes.forEach((cn) => {
        ensureSpace(16);
        doc.setFillColor(254, 252, 232);
        doc.setDrawColor(253, 224, 71);
        doc.roundedRect(margin, y - 3, contentWidth, 14, 1.5, 1.5, 'FD');
        drawSafeText(
          doc,
          `Complaint: ${cn.chiefComplaint}  |  Logged: ${cn.loggedAt}`,
          margin + 3,
          y + 1.5,
          { fontSize: 8.5, fontWeight: 'bold', color: [113, 63, 18], maxWidthMm: contentWidth - 6 }
        );
        drawSafeText(doc, `Assessment: ${cn.clinicalAssessment}`, margin + 3, y + 6, {
          fontSize: 8,
          color: [15, 23, 42],
          maxWidthMm: contentWidth - 6,
        });
        drawSafeText(
          doc,
          `Follow-Up (${cn.followUpDate}): ${cn.followUpTriggerAction}`,
          margin + 3,
          y + 9.8,
          { fontSize: 7.8, color: [15, 118, 110], maxWidthMm: contentWidth - 6 }
        );
        y += 16;
      });
    }
  }

  // 6. VACCINATION & IMMUNIZATION RECORDS
  if (sections.immunizations && input.patient.vaccines.length > 0) {
    drawSectionHeader(
      '4. IMMUNIZATION & VACCINATION STATUS',
      `${input.patient.vaccines.length} records`
    );
    input.patient.vaccines.forEach((vac, idx) => {
      ensureSpace(8);
      if (idx % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y - 4.5, contentWidth, 6.5, 'F');
      }
      drawSafeText(
        doc,
        `${vac.vaccineName} (Dose #${vac.doseNumber}) — ${vac.clinicName}`,
        margin + 2,
        y,
        { fontSize: 8.5, color: [15, 23, 42], maxWidthMm: 130 }
      );
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      if (vac.status === 'Completed') doc.setTextColor(21, 128, 61);
      else doc.setTextColor(180, 83, 9);
      doc.text(`${vac.scheduledDate} · ${vac.status.toUpperCase()}`, margin + 138, y);
      y += 6.5;
    });
    y += 4;
  }

  // 7. PHYSICIAN SIGNATURE & OFFLINE USE FOOTER
  ensureSpace(22);
  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  drawSafeText(
    doc,
    `Digitally Verified by: ${input.doctorName} (${input.registrationId})`,
    margin,
    y,
    { fontSize: 8.5, fontWeight: 'bold', color: [15, 23, 42], maxWidthMm: 110 }
  );
  doc.text('OFFLINE CLINICAL DOSSIER STAMP:', pageWidth - margin - 60, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Exported from Preventia Doctor’s Clinical Portal for offline clinical reference, patient handover, and medical record archiving.',
    margin,
    pageHeight - 10
  );

  const sanitizedPatient = (input.patient.name || 'Patient')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  const datePart = new Date().toISOString().slice(0, 10);
  const fileName = `Preventia_Clinical_Report_${sanitizedPatient}_${datePart}.pdf`;

  doc.save(fileName);
  return fileName;
}
