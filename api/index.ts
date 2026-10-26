import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "2mb" }));

function getGeminiClient() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Preventia Community Health API",
    timestamp: new Date().toISOString(),
  });
});

// Runtime Google Maps Platform configuration endpoint
app.get("/api/maps-config", (_req, res) => {
  const apiKey =
    process.env.VITE_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    "AIzaSyAXGEIQHjxA80u_45FzLWMbk1S3y589WYg";
  res.json({ apiKey });
});

function buildFallbackTriageAssessment(
  symptoms: string,
  age: number | string,
  severity: string,
  language: string
) {
  const sLower = (symptoms || "").toLowerCase();
  const isEmergency =
    sLower.includes("chest pain") ||
    sLower.includes("breathless") ||
    sLower.includes("stroke") ||
    sLower.includes("छातीत") ||
    sLower.includes("सीने में दर्द") ||
    sLower.includes("धाप") ||
    sLower.includes("सांस");
  const isUrgent =
    !isEmergency &&
    (severity === "Severe" ||
      sLower.includes("fever") ||
      sLower.includes("ताप") ||
      sLower.includes("बुखार") ||
      sLower.includes("dizziness") ||
      sLower.includes("चक्कर"));

  if (language === "mr") {
    return {
      urgencyLevel: isEmergency ? "Emergency" : isUrgent ? "Urgent" : "Routine",
      urgencyBadgeText: isEmergency
        ? "तात्काळ आणीबाणी (Emergency)"
        : isUrgent
        ? "तातडीची वैद्यकीय तपासणी (Urgent)"
        : "नियमित प्रतिबंधात्मक काळजी (Routine)",
      summaryAssessment: `तुमची लक्षणे ("${symptoms}") आणि वय (${age || 60} वर्षे) लक्षात घेता, ${
        isEmergency
          ? "तात्काळ जवळच्या रुग्णालयात किंवा १०८ रुग्णवाहिकेशी संपर्क साधणे आवश्यक आहे."
          : isUrgent
          ? "पुढील २४ तासांत फॅमिली डॉक्टर किंवा प्राथमिक आरोग्य केंद्रात प्रत्यक्ष किंवा व्हिडिओ कन्सल्टेशनद्वारे तपासणी करून घ्यावी."
          : "सध्या ही लक्षणे सौम्य दिसत आहेत; पुरेशी विश्रांती, वेळेवर पाणी आणि रक्तदाब/शुगरची नियमित नोंद ठेवावी."
      }`,
      recommendedAction: isEmergency
        ? "तात्काळ १०८ वर कॉल करा किंवा जवळच्या २४x७ इमर्जन्सी हॉस्पिटलमध्ये जा."
        : "आजच Preventia टेलिमेडिसिनद्वारे तुमच्या फॅमिली डॉक्टरांशी संवाद साधा आणि तुमचे BP व तापमान तपासा.",
      possibleCauses: [
        "हंगामी विषाणूजन्य संसर्ग किंवा हवामानातील बदल",
        "रक्तदाब (BP) किंवा रक्तातील साखरेतील चढ-उतार",
        "शरीरातील पाण्याची कमतरता (Dehydration) किंवा थकवा",
      ],
      preventiveCareSteps: [
        "दर ६ तासांनी तापमान, रक्तदाब (BP) आणि नाडीचे ठोके तपासा.",
        "कोमट पाणी, लिंबू पाणी किंवा ताक पुरेशा प्रमाणात घ्या.",
        "डॉक्टरांच्या सल्ल्याशिवाय कोणतीही अँटीबायोटिक किंवा पेनकिलर घेऊ नका.",
      ],
      dietaryAdvice:
        "पचनास हलका, ताजा आणि कमी मिठाचा आहार घ्या — उदा. मुगाची खिचडी, वरण-भात, ताज्या भाज्यांचे सूप आणि कोमट पाणी.",
      redFlags: [
        "छातीत तीव्र वेदना, धाप लागणे किंवा श्वास घेण्यास त्रास होणे",
        "१०२°F पेक्षा जास्त ताप सतत राहणे किंवा तीव्र चक्कर येणे",
        "अचानक बोलताना अडखळणे किंवा हाता-पायांत लुळेपणा जाणवणे",
      ],
    };
  }

  if (language === "hi") {
    return {
      urgencyLevel: isEmergency ? "Emergency" : isUrgent ? "Urgent" : "Routine",
      urgencyBadgeText: isEmergency
        ? "तत्काल आपातकालीन (Emergency)"
        : isUrgent
        ? "शीघ्र डॉक्टर परामर्श (Urgent)"
        : "सामान्य निवारक देखभाल (Routine)",
      summaryAssessment: `आपके लक्षण ("${symptoms}") और आयु (${age || 60} वर्ष) के आधार पर, ${
        isEmergency
          ? "तुरंत नजदीकी अस्पताल जाएं या 108 एम्बुलेंस पर कॉल करें।"
          : isUrgent
          ? "अगले 24 घंटों में अपने फैमिली डॉक्टर से टेली-परामर्श या क्लिनिक में जांच कराएं।"
          : "पर्याप्त आराम करें, गुनगुना पानी पिएं और अपने बीपी/शुगर की निगरानी जारी रखें।"
      }`,
      recommendedAction: isEmergency
        ? "तुरंत 108 आपातकालीन सेवा पर कॉल करें या नजदीकी अस्पताल जाएं।"
        : "Preventia टेलीमेडिसिन कंसोल से अपने डॉक्टर को संदेश या कॉल करें और आज का BP/तापमान नोट करें।",
      possibleCauses: [
        "मौसमी वायरल संक्रमण या मौसम में बदलाव",
        "ब्लड प्रेशर (BP) या ब्लड शुगर में उतार-चढ़ाव",
        "शरीर में पानी की कमी (निर्जलीकरण) या शारीरिक थकान",
      ],
      preventiveCareSteps: [
        "दिन में दो बार अपना रक्तचाप (BP) और शरीर का तापमान जांचें।",
        "पर्याप्त मात्रा में गुनगुना पानी, सूप या छाछ पिएं।",
        "बिना डॉक्टर की सलाह के कोई भी तेज दवा न लें।",
      ],
      dietaryAdvice:
        "सुपाच्य, कम नमक और कम तेल वाला ताजा भोजन लें — जैसे मूंग दाल खिचड़ी, दलिया, हरी सब्जियों का सूप और गुनगुना पानी।",
      redFlags: [
        "सीने में तेज दर्द या सांस लेने में कठिनाई होना",
        "तेज बुखार (102°F से अधिक) या बार-बार चक्कर आना",
        "अचानक कमजोरी या बोलने में परेशानी होना",
      ],
    };
  }

  return {
    urgencyLevel: isEmergency ? "Emergency" : isUrgent ? "Urgent" : "Routine",
    urgencyBadgeText: isEmergency
      ? "Immediate Emergency Care"
      : isUrgent
      ? "Prompt Clinical Consultation"
      : "Routine Preventive Care",
    summaryAssessment: `Based on your reported symptoms ("${symptoms}") and age (${
      age || 60
    } yrs), ${
      isEmergency
        ? "immediate emergency medical evaluation at the nearest hospital is strongly advised."
        : isUrgent
        ? "we recommend consulting your family physician within 24 hours via Telemedicine or clinic visit while monitoring vitals closely."
        : "these symptoms can be managed with structured rest, hydration, and regular vital monitoring unless warning signs develop."
    }`,
    recommendedAction: isEmergency
      ? "Dial 108 Emergency Helpline immediately or proceed to the nearest 24x7 emergency department."
      : "Log your current Blood Pressure and temperature, and share them with your family doctor in the Telemedicine tab.",
    possibleCauses: [
      "Seasonal viral infection or weather transition sensitivity",
      "Blood pressure or glycemic fluctuation requiring dose review",
      "Mild dehydration, electrolyte imbalance, or physical fatigue",
    ],
    preventiveCareSteps: [
      "Check and record Blood Pressure, pulse, and temperature twice daily.",
      "Maintain steady hydration with warm water, clear soups, or buttermilk.",
      "Continue prescribed chronic medications on time and avoid self-medicating with NSAIDs.",
    ],
    dietaryAdvice:
      "Follow a warm, low-sodium, easily digestible diet such as moong dal khichdi, steamed vegetables, clear soup, and adequate warm fluids.",
    redFlags: [
      "Chest pain, pressure, or shortness of breath at rest",
      "Persistent high fever above 102°F or confusion/fainting",
      "Sudden weakness on one side of the body or slurred speech",
    ],
  };
}

// AI Triage & Initial Symptom Assessment Endpoint
app.post("/api/triage", async (req, res) => {
  const { symptoms, age, duration, severity, language, history } = req.body || {};
  if (!symptoms || typeof symptoms !== "string") {
    return res.status(400).json({ error: "Symptoms description is required." });
  }

  try {
    const ai = getGeminiClient();
    const langName =
      language === "hi" ? "Hindi (हिंदी)" : language === "mr" ? "Marathi (मराठी)" : "English";

    const prompt = `Patient Age: ${age || "Adult"}
Reported Symptoms: ${symptoms}
Duration: ${duration || "Recent"}
Self-Reported Severity: ${severity || "Moderate"}
Conversation Context: ${JSON.stringify(history || [])}

Perform a compassionate, clinically grounded preventive health and triage assessment. Respond ENTIRELY in ${langName}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are Preventia AI Triage Assistant, a community preventive care and clinical triage support system designed for patients and elderly citizens in India.
Always respond in the requested language (${langName}) using clear, respectful, easy-to-understand language suitable for elderly patients.
Provide structured JSON output evaluating urgency level ('Emergency', 'Urgent', 'Routine', or 'Self-Care'), a clear summary assessment, potential common causes (non-diagnostic awareness), immediate home/preventive care steps, dietary advice, and red-flag warning signs that require visiting the nearest hospital immediately.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            urgencyLevel: {
              type: Type.STRING,
              description: "One of: Emergency, Urgent, Routine, Self-Care",
            },
            urgencyBadgeText: {
              type: Type.STRING,
              description: "Localized urgency label in target language",
            },
            summaryAssessment: {
              type: Type.STRING,
              description: "Warm, clear explanation of what the symptoms may indicate and priority level",
            },
            recommendedAction: {
              type: Type.STRING,
              description: "Immediate next step (e.g., Visit nearest clinic within 24h, Call emergency 108, Rest & hydrate)",
            },
            possibleCauses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 to 4 possible common health causes for awareness",
            },
            preventiveCareSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 4 actionable preventive and self-care measures",
            },
            dietaryAdvice: {
              type: Type.STRING,
              description: "Age-appropriate diet and hydration advice during recovery",
            },
            redFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Warning symptoms that require immediate hospital emergency care",
            },
          },
          required: [
            "urgencyLevel",
            "urgencyBadgeText",
            "summaryAssessment",
            "recommendedAction",
            "possibleCauses",
            "preventiveCareSteps",
            "dietaryAdvice",
            "redFlags",
          ],
        },
      },
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text.trim());
    return res.json(parsed);
  } catch {
    // Graceful clinical fallback when Gemini quota is reached
    return res.json(
      buildFallbackTriageAssessment(
        symptoms,
        age || 60,
        severity || "Moderate",
        language || "en"
      )
    );
  }
});

// Real-Time Doctor-Patient Tele-Consultation Room Store (keyed by normalized doctor phone / room code)
interface TeleconsultMessage {
  id: string;
  sender: "patient" | "doctor";
  senderName: string;
  text: string;
  timestamp: string;
  createdAtMs: number;
}

interface TeleconsultRoomState {
  roomKey: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorPhone: string;
  patientName: string;
  patientPhone: string;
  patientAge: number;
  vitals: {
    systolic: number;
    diastolic: number;
    heartRate: number;
    bloodSugar: number;
  };
  callStatus: "idle" | "ringing" | "connected" | "declined" | "ended";
  callType: "voice" | "video";
  callInitiatedBy: "patient" | "doctor";
  callStartedAtMs: number | null;
  callConnectedAtMs: number | null;
  humanDoctorOnline: boolean;
  lastDoctorHeartbeatMs: number;
  messages: TeleconsultMessage[];
  updatedAtMs: number;
}

const teleconsultRooms = new Map<string, TeleconsultRoomState>();

function normalizeRoomKey(raw: string): string {
  const digits = (raw || "").replace(/\D/g, "");
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return (raw || "default-room").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "default-room";
}

function getOrCreateRoom(roomKeyRaw: string, partial?: Partial<TeleconsultRoomState>): TeleconsultRoomState {
  const key = normalizeRoomKey(roomKeyRaw);
  const existing = teleconsultRooms.get(key);
  const now = Date.now();
  if (existing) {
    if (partial) {
      if (partial.doctorName) existing.doctorName = partial.doctorName;
      if (partial.doctorSpecialty) existing.doctorSpecialty = partial.doctorSpecialty;
      if (partial.doctorPhone) existing.doctorPhone = partial.doctorPhone;
      if (partial.patientName) existing.patientName = partial.patientName;
      if (partial.patientPhone) existing.patientPhone = partial.patientPhone;
      if (typeof partial.patientAge === "number") existing.patientAge = partial.patientAge;
      if (partial.vitals) existing.vitals = partial.vitals;
      existing.updatedAtMs = now;
    }
    // Expire humanDoctorOnline if no heartbeat for 20 seconds
    if (existing.humanDoctorOnline && now - existing.lastDoctorHeartbeatMs > 20000) {
      existing.humanDoctorOnline = false;
    }
    return existing;
  }

  const created: TeleconsultRoomState = {
    roomKey: key,
    doctorName: partial?.doctorName || "Family Doctor",
    doctorSpecialty: partial?.doctorSpecialty || "General Physician",
    doctorPhone: partial?.doctorPhone || roomKeyRaw,
    patientName: partial?.patientName || "Patient",
    patientPhone: partial?.patientPhone || "",
    patientAge: partial?.patientAge || 60,
    vitals: partial?.vitals || {
      systolic: 124,
      diastolic: 80,
      heartRate: 74,
      bloodSugar: 104,
    },
    callStatus: "idle",
    callType: "video",
    callInitiatedBy: "patient",
    callStartedAtMs: null,
    callConnectedAtMs: null,
    humanDoctorOnline: false,
    lastDoctorHeartbeatMs: 0,
    messages: [],
    updatedAtMs: now,
  };
  teleconsultRooms.set(key, created);
  return created;
}

function buildFallbackDoctorReply(
  doctorName: string,
  specialty: string,
  patientMessage: string,
  language: string,
  vitals?: { systolic?: number; diastolic?: number; heartRate?: number; bloodSugar?: number }
): string {
  const msgLower = (patientMessage || "").toLowerCase();
  const bpStr = vitals?.systolic && vitals?.diastolic ? `${vitals.systolic}/${vitals.diastolic} mmHg` : "124/80 mmHg";
  const sugarStr = vitals?.bloodSugar ? `${vitals.bloodSugar} mg/dL` : "104 mg/dL";

  if (language === "mr") {
    if (msgLower.includes("bp") || msgLower.includes("रक्तदाब") || msgLower.includes("शुगर") || msgLower.includes("रीडिंग")) {
      return `नमस्कार, मी ${doctorName} (${specialty}). मला तुमचे आजचे रीडिंग (BP: ${bpStr}, शुगर: ${sugarStr}) मिळाले आहे. सध्या तुमचे रीडिंग नियंत्रणात दिसत आहे; कृपया वेळेवर गोळ्या घ्या, आहारात मीठ कमी ठेवा आणि काही चक्कर किंवा थकवा जाणवल्यास मला लगेच कॉल करा.`;
    }
    if (msgLower.includes("ताप") || msgLower.includes("fever") || msgLower.includes("खोकला") || msgLower.includes("सर्दी")) {
      return `नमस्कार, मी ${doctorName}. काळजी करू नका. कोमट पाणी प्या, पुरेशी विश्रांती घ्या आणि दिवसातून दोनदा तापमान तपासा. ताप १००°F पेक्षा जास्त राहिल्यास आपण व्हिडिओ कॉलवर किंवा क्लिनिकमध्ये प्रत्यक्ष तपासणी करूया.`;
    }
    return `नमस्कार, मी ${doctorName} (${specialty}). तुमचा मेसेज मला मिळाला आहे. मी तुमचे आरोग्य रेकॉर्ड पाहिले आहे (BP: ${bpStr}, शुगर: ${sugarStr}). तुम्हाला हा त्रास कधीपासून होत आहे? हवे असल्यास तुम्ही आताच मला व्हॉइस किंवा व्हिडिओ कॉल करू शकता.`;
  }

  if (language === "hi") {
    if (msgLower.includes("bp") || msgLower.includes("बीपी") || msgLower.includes("शुगर") || msgLower.includes("रीडिंग")) {
      return `नमस्ते, मैं ${doctorName} (${specialty}) बोल रहा हूँ। मुझे आपकी आज की रीडिंग (BP: ${bpStr}, शुगर: ${sugarStr}) मिल गई है। अपनी नियमित दवाइयाँ समय पर लें, नमक कम खाएं और किसी भी असुविधा पर तुरंत मुझे कॉल करें।`;
    }
    if (msgLower.includes("बुखार") || msgLower.includes("fever") || msgLower.includes("खांसी") || msgLower.includes("दर्द")) {
      return `नमस्ते, मैं ${doctorName}। चिंता न करें, गुनगुना पानी पिएं और पूरा आराम करें। यदि बुखार या दर्द बढ़ता है तो तुरंत ऊपर दिए गए कॉल बटन से मुझसे बात करें या क्लिनिक आएं।`;
    }
    return `नमस्ते, मैं ${doctorName} (${specialty})। आपका संदेश मुझे मिल गया है और मैंने आपका स्वास्थ्य डेटा (BP: ${bpStr}, शुगर: ${sugarStr}) देख लिया है। यह समस्या आपको कब से हो रही है? आप चाहें तो अभी कॉल पर बात कर सकते हैं।`;
  }

  if (msgLower.includes("bp") || msgLower.includes("sugar") || msgLower.includes("vital") || msgLower.includes("reading")) {
    return `Hello, this is ${doctorName} (${specialty}). I have received your latest vitals (BP: ${bpStr}, Blood Sugar: ${sugarStr}). Please continue your prescribed medications on schedule, stay well hydrated, and let me know if you feel any dizziness or headache.`;
  }
  return `Hello, this is ${doctorName} (${specialty}). I received your message and reviewed your vitals (BP: ${bpStr}, Sugar: ${sugarStr}). How long have you been noticing this, and have you taken today's prescribed dose? You can also speak with me directly on the voice or video call.`;
}

async function generateDoctorReplyText(params: {
  doctorName: string;
  specialty: string;
  patientMessage: string;
  patientAge?: number;
  language?: string;
  vitals?: { systolic?: number; diastolic?: number; heartRate?: number; bloodSugar?: number };
  isLiveCall?: boolean;
}): Promise<string> {
  const { doctorName, specialty, patientMessage, patientAge, language = "en", vitals, isLiveCall } = params;
  const langName =
    language === "hi" ? "Hindi (हिंदी)" : language === "mr" ? "Marathi (मराठी)" : "English";
  const vitalsContext = vitals
    ? `Patient Live Vitals: BP ${vitals.systolic || 124}/${vitals.diastolic || 80} mmHg, Fasting Sugar ${vitals.bloodSugar || 104} mg/dL, Heart Rate ${vitals.heartRate || 74} bpm.`
    : "";

  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Patient (Age ${patientAge || 60}) says: "${patientMessage}"\n${vitalsContext}`,
      config: {
        systemInstruction: `You are ${doctorName || "Dr. Vivek Patil"}, the patient's trusted ${specialty || "Family Physician"} on the Preventia Telemedicine platform.
${isLiveCall ? "You are currently speaking LIVE on a real-time voice/video call with the patient." : "You are replying directly to the patient's message."}
Respond directly to the patient in ${langName} in 2 to 3 warm, natural, reassuring clinical sentences. Reference their vitals if relevant, give practical advice, and ask 1 short follow-up question.`,
      },
    });
    if (response.text && response.text.trim()) {
      return response.text.trim();
    }
  } catch {
    // Gracefully fall through to clinical doctor response when Gemini quota is reached
  }

  return buildFallbackDoctorReply(
    doctorName || "Doctor",
    specialty || "Family Physician",
    patientMessage,
    language,
    vitals
  );
}

// Poll or fetch live Tele-Consultation Room state (used by both Patient view and Doctor Receiver Console)
app.get("/api/teleconsult/room/:roomKey", (req, res) => {
  const role = req.query.role as string | undefined;
  const room = getOrCreateRoom(req.params.roomKey);
  if (role === "doctor") {
    room.humanDoctorOnline = true;
    room.lastDoctorHeartbeatMs = Date.now();
  }
  return res.json(room);
});

// Start, Answer, Decline, or End a Live Voice/Video Call between Patient and Doctor
app.post("/api/teleconsult/call-action", async (req, res) => {
  const {
    roomKey,
    action,
    callType,
    initiatedBy,
    doctorName,
    doctorSpecialty,
    doctorPhone,
    patientName,
    patientPhone,
    patientAge,
    vitals,
    language,
  } = req.body;

  const room = getOrCreateRoom(roomKey || doctorPhone || "default", {
    doctorName,
    doctorSpecialty,
    doctorPhone,
    patientName,
    patientPhone,
    patientAge,
    vitals,
  });

  const now = Date.now();
  const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (action === "start") {
    room.callStatus = "ringing";
    room.callType = callType === "voice" ? "voice" : "video";
    room.callInitiatedBy = initiatedBy === "doctor" ? "doctor" : "patient";
    room.callStartedAtMs = now;
    room.callConnectedAtMs = null;
  } else if (action === "answer") {
    const wasAlreadyConnected = room.callStatus === "connected";
    room.callStatus = "connected";
    room.callConnectedAtMs = room.callConnectedAtMs || now;

    if (req.body.answeredBy === "human_doctor") {
      room.humanDoctorOnline = true;
      room.lastDoctorHeartbeatMs = now;
    }

    // Add initial doctor greeting on call connect if not already greeted
    if (!wasAlreadyConnected) {
      const greeting =
        language === "mr"
          ? `नमस्कार ${room.patientName}, मी ${room.doctorName} बोलत आहे. तुमचा कॉल जोडला गेला आहे आणि तुमचे आजचे रीडिंग (BP: ${room.vitals.systolic}/${room.vitals.diastolic}, शुगर: ${room.vitals.bloodSugar}) माझ्यासमोर आहे. तुम्हाला काय त्रास होत आहे ते सांगा.`
          : language === "hi"
          ? `नमस्ते ${room.patientName}, मैं ${room.doctorName} बोल रहा हूँ। आपकी कॉल कनेक्ट हो गई है और मैं आपका लाइव बीपी (${room.vitals.systolic}/${room.vitals.diastolic}) और शुगर (${room.vitals.bloodSugar}) देख पा रहा हूँ। बताइए, आज आपको कैसा महसूस हो रहा है?`
          : `Hello ${room.patientName}, this is ${room.doctorName} on the line. Your call is connected and I can see your live vitals (BP: ${room.vitals.systolic}/${room.vitals.diastolic} mmHg, Sugar: ${room.vitals.bloodSugar} mg/dL). How are you feeling today?`;

      room.messages.push({
        id: `call-greet-${now}`,
        sender: "doctor",
        senderName: room.doctorName,
        text: greeting,
        timestamp: timeStr,
        createdAtMs: now,
      });
      return res.json({ room, greeting });
    }
  } else if (action === "decline") {
    room.callStatus = "declined";
  } else if (action === "end") {
    room.callStatus = "ended";
  }

  room.updatedAtMs = now;
  return res.json({ room });
});

// Send a real-time message (or live voice call speech turn) in the Tele-Consultation Room
app.post("/api/teleconsult/message", async (req, res) => {
  const {
    roomKey,
    sender,
    text,
    doctorName,
    doctorSpecialty,
    doctorPhone,
    patientName,
    patientPhone,
    patientAge,
    vitals,
    language,
    isLiveCall,
    skipAutoReply,
  } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Message text is required" });
  }

  const room = getOrCreateRoom(roomKey || doctorPhone || "default", {
    doctorName,
    doctorSpecialty,
    doctorPhone,
    patientName,
    patientPhone,
    patientAge,
    vitals,
  });

  const now = Date.now();
  const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (sender === "doctor") {
    room.humanDoctorOnline = true;
    room.lastDoctorHeartbeatMs = now;
  }

  const newMsg: TeleconsultMessage = {
    id: `msg-${now}-${Math.random().toString(36).slice(2, 6)}`,
    sender: sender === "doctor" ? "doctor" : "patient",
    senderName: sender === "doctor" ? room.doctorName : room.patientName,
    text: text.trim(),
    timestamp: timeStr,
    createdAtMs: now,
  };
  room.messages.push(newMsg);
  room.updatedAtMs = now;

  // If patient sent the message and no human doctor is actively typing in the Doctor Portal (unless skipAutoReply is set), generate an immediate doctor reply so the patient ALWAYS gets a response
  let doctorReplyMsg: TeleconsultMessage | null = null;
  if (sender === "patient" && !skipAutoReply && !room.humanDoctorOnline) {
    const replyText = await generateDoctorReplyText({
      doctorName: room.doctorName,
      specialty: room.doctorSpecialty,
      patientMessage: text.trim(),
      patientAge: room.patientAge,
      language,
      vitals: room.vitals,
      isLiveCall: Boolean(isLiveCall),
    });

    const replyNow = Date.now();
    doctorReplyMsg = {
      id: `msg-${replyNow}-doc`,
      sender: "doctor",
      senderName: room.doctorName,
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAtMs: replyNow,
    };
    room.messages.push(doctorReplyMsg);
    room.updatedAtMs = replyNow;
  }

  return res.json({
    room,
    message: newMsg,
    doctorReply: doctorReplyMsg,
  });
});

// Local Doctor Quick Consultation AI Co-Pilot Reply Endpoint
app.post("/api/doctor-consult-reply", async (req, res) => {
  try {
    const { doctorName, specialty, patientMessage, patientAge, language, vitals, isLiveCall } = req.body;
    if (!patientMessage) {
      return res.status(400).json({ error: "Patient message is required." });
    }

    const reply = await generateDoctorReplyText({
      doctorName: doctorName || "Dr. Vivek Patil",
      specialty: specialty || "Family Physician",
      patientMessage,
      patientAge,
      language,
      vitals,
      isLiveCall,
    });

    return res.json({ reply });
  } catch {
    const fallback = buildFallbackDoctorReply(
      req.body?.doctorName || "Doctor",
      req.body?.specialty || "Family Physician",
      req.body?.patientMessage || "",
      req.body?.language || "en",
      req.body?.vitals
    );
    return res.json({ reply: fallback });
  }
});

// In-memory TTS Audio Cache & Free-Tier Quota Cooldown Tracker
const ttsAudioCache = new Map<string, { audioBase64: string; mimeType: string }>();
let liteTtsCooldownUntilMs = 0;
let flashTtsCooldownUntilMs = 0;

// Multilingual Female Voice Text-to-Speech Endpoint (Marathi, Hindi, English)
app.post("/api/tts", async (req, res) => {
  const { text, language } = req.body || {};
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Text is required for speech synthesis." });
  }

  const normalizedText = text.trim().slice(0, 1200);
  const cacheKey = `${language || "en"}:${normalizedText}`;
  const cached = ttsAudioCache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  const now = Date.now();
  const candidateModels: string[] = [];
  if (now >= liteTtsCooldownUntilMs) {
    candidateModels.push("gemini-3.8-flash-lite-tts");
  }
  if (now >= flashTtsCooldownUntilMs) {
    candidateModels.push("gemini-3.8-flash-tts");
  }

  // If both TTS models are currently in free-tier quota cooldown, instruct client to use browser female voice cleanly
  if (candidateModels.length === 0) {
    return res.json({
      audioBase64: null,
      useBrowserFallback: true,
      reason: "quota_cooldown",
    });
  }

  const langLabel =
    language === "mr"
      ? "Marathi (मराठी)"
      : language === "hi"
      ? "Hindi (हिंदी)"
      : "English";

  const ai = getGeminiClient();

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          {
            role: "user",
            parts: [
              {
                text: normalizedText,
                speechMetadata: {
                  style: `Warm, compassionate, clear Indian female healthcare educator speaking naturally in ${langLabel}`,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Kore" },
            },
          },
        },
      });

      const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      if (inlineData && inlineData.data) {
        const resultPayload = {
          audioBase64: inlineData.data,
          mimeType: inlineData.mimeType || "audio/pcm;rate=24000",
        };
        if (ttsAudioCache.size > 100) {
          const firstKey = ttsAudioCache.keys().next().value;
          if (firstKey) ttsAudioCache.delete(firstKey);
        }
        ttsAudioCache.set(cacheKey, resultPayload);
        return res.json(resultPayload);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      const isQuotaError =
        errMsg.includes("429") ||
        errMsg.includes("RESOURCE_EXHAUSTED") ||
        errMsg.includes("quota");
      if (isQuotaError) {
        // Put this model on a 5-minute cooldown so we don't repeatedly hit 429
        if (modelName === "gemini-3.8-flash-lite-tts") {
          liteTtsCooldownUntilMs = Date.now() + 5 * 60 * 1000;
        } else {
          flashTtsCooldownUntilMs = Date.now() + 5 * 60 * 1000;
        }
      }
    }
  }

  // Clean 200 response telling the client to use the built-in browser Marathi/Hindi/English female voice
  return res.json({
    audioBase64: null,
    useBrowserFallback: true,
    reason: "fallback_to_browser_tts",
  });
});

// Fallback IP Geolocation Endpoint for iframe environments where hardware GPS is blocked
app.get("/api/ip-location", async (_req, res) => {
  try {
    const geoRes = await fetch("https://ipapi.co/json/", {
      headers: { "User-Agent": "preventia-health-app" },
    });
    if (geoRes.ok) {
      const data = await geoRes.json();
      if (typeof data.latitude === "number" && typeof data.longitude === "number") {
        return res.json({
          lat: data.latitude,
          lng: data.longitude,
          city: data.city || "Detected Location",
          region: data.region || "",
          source: "ip",
        });
      }
    }
  } catch {
    // Ignore and fall through to default Maharashtra/India community center
  }

  return res.json({
    lat: 18.5204,
    lng: 73.8567,
    city: "Pune",
    region: "Maharashtra",
    source: "default",
  });
});

export default app;
