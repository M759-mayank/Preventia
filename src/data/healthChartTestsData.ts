import { Language } from '../i18n/translations';

export type TestCategoryId =
  | 'all'
  | 'cbc'
  | 'diabetes'
  | 'lipid'
  | 'kidney_liver'
  | 'thyroid_vitamins'
  | 'vitals_cardiac'
  | 'urine_other';

export interface LabTestReferenceItem {
  id: string;
  category: Exclude<TestCategoryId, 'all'>;
  name: Record<Language, string>;
  shortCode: string;
  unit: string;
  normalMin: number;
  normalMax: number;
  borderlineLow?: number;
  borderlineHigh?: number;
  normalRangeText: Record<Language, string>;
  borderlineRangeText: Record<Language, string>;
  abnormalRangeText: Record<Language, string>;
  maleFemaleNote?: Record<Language, string>;
  fastingRequired: boolean;
  whatItMeasures: Record<Language, string>;
  clinicalTips: Record<Language, string>;
}

export const TEST_CATEGORIES: {
  id: TestCategoryId;
  label: Record<Language, string>;
  badge: string;
}[] = [
  {
    id: 'all',
    label: {
      en: 'All Blood & Diagnostic Tests',
      hi: 'सभी रक्त और स्वास्थ्य जांच',
      mr: 'सर्व रक्त आणि आरोग्य चाचण्या',
    },
    badge: '30 Tests',
  },
  {
    id: 'cbc',
    label: {
      en: 'Complete Blood Count (CBC)',
      hi: 'संपूर्ण रक्त गणना (CBC)',
      mr: 'संपूर्ण रक्त गणना (CBC)',
    },
    badge: '6 Tests',
  },
  {
    id: 'diabetes',
    label: {
      en: 'Blood Sugar & Diabetes',
      hi: 'ब्लड शुगर और मधुमेह',
      mr: 'ब्लड शुगर आणि मधुमेह',
    },
    badge: '4 Tests',
  },
  {
    id: 'lipid',
    label: {
      en: 'Lipid Profile (Cholesterol)',
      hi: 'लिपिड प्रोफाइल (कोलेस्ट्रॉल)',
      mr: 'लिपिड प्रोफाइल (कोलेस्ट्रॉल)',
    },
    badge: '5 Tests',
  },
  {
    id: 'kidney_liver',
    label: {
      en: 'Kidney (KFT) & Liver (LFT)',
      hi: 'किडनी (KFT) और लिवर (LFT)',
      mr: 'किडनी (KFT) आणि लिव्हर (LFT)',
    },
    badge: '6 Tests',
  },
  {
    id: 'thyroid_vitamins',
    label: {
      en: 'Thyroid, Vitamins & Minerals',
      hi: 'थायरॉइड, विटामिन और मिनरल्स',
      mr: 'थायरॉइड, जीवनसत्त्वे आणि खनिजे',
    },
    badge: '5 Tests',
  },
  {
    id: 'vitals_cardiac',
    label: {
      en: 'Vitals, Cardiac & Lung Tests',
      hi: 'वाइटल्स, हृदय और फेफड़ों की जांच',
      mr: 'व्हायटल्स, हृदय आणि फुफ्फुस चाचण्या',
    },
    badge: '4 Tests',
  },
  {
    id: 'urine_other',
    label: {
      en: 'Urine, Bone, Eye & Screening Tests',
      hi: 'मूत्र, हड्डी, नेत्र और अन्य जांच',
      mr: 'लघवी, हाडे, डोळे आणि इतर चाचण्या',
    },
    badge: '4 Tests',
  },
];

export const LAB_TEST_REFERENCES: LabTestReferenceItem[] = [
  // 1. CBC (Complete Blood Count)
  {
    id: 'hemoglobin',
    category: 'cbc',
    name: {
      en: 'Hemoglobin (Hb)',
      hi: 'हीमोग्लोबिन (Hb - खून की मात्रा)',
      mr: 'हिमोग्लोबिन (Hb - रक्तातील प्रमाण)',
    },
    shortCode: 'Hb',
    unit: 'g/dL',
    normalMin: 12.0,
    normalMax: 17.0,
    borderlineLow: 10.5,
    borderlineHigh: 18.0,
    normalRangeText: {
      en: 'Men: 13.5–17.5 g/dL | Women: 12.0–15.5 g/dL',
      hi: 'पुरुष: 13.5–17.5 g/dL | महिला: 12.0–15.5 g/dL',
      mr: 'पुरुष: १३.५–१७.५ g/dL | महिला: १२.०–१५.५ g/dL',
    },
    borderlineRangeText: {
      en: '10.0–11.9 g/dL (Mild Anemia)',
      hi: '10.0–11.9 g/dL (हल्की खून की कमी)',
      mr: '१०.०–११.९ g/dL (सौम्य ॲनिमिया / रक्तक्षय)',
    },
    abnormalRangeText: {
      en: '< 10.0 g/dL (Moderate/Severe Anemia) or > 18.0 g/dL',
      hi: '< 10.0 g/dL (गंभीर एनीमिया) या > 18.0 g/dL',
      mr: '< १०.० g/dL (तीव्र रक्तक्षय) किंवा > १८.० g/dL',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Oxygen-carrying protein inside red blood cells; detects anemia or polycythemia.',
      hi: 'लाल रक्त कोशिकाओं में ऑक्सीजन ले जाने वाला प्रोटीन; एनीमिया की पहचान करता है।',
      mr: 'लाल रक्तपेशींमधील ऑक्सिजन वाहून नेणारे प्रथिन; ॲनिमिया (रक्तक्षय) ओळखते.',
    },
    clinicalTips: {
      en: 'Include iron-rich spinach, beetroot, pomegranate, jaggery, dates, and Vitamin C for absorption.',
      hi: 'पालक, चुकंदर, अनार, गुड़, खजूर और आंवला (विटामिन C) आहार में शामिल करें।',
      mr: 'आहारात पालक, बीट, डाळिंब, गूळ, खजूर आणि आवळा (व्हिटॅमिन C) समाविष्ट करा.',
    },
  },
  {
    id: 'wbc',
    category: 'cbc',
    name: {
      en: 'Total Leukocyte Count (WBC)',
      hi: 'श्वेत रक्त कोशिकाएं (WBC / TLC)',
      mr: 'पांढऱ्या रक्तपेशी (WBC / TLC)',
    },
    shortCode: 'WBC',
    unit: 'cells/µL',
    normalMin: 4000,
    normalMax: 11000,
    borderlineLow: 3500,
    borderlineHigh: 12500,
    normalRangeText: {
      en: '4,000 – 11,000 cells/µL',
      hi: '4,000 – 11,000 cells/µL',
      mr: '४,००० – ११,००० पेशी/µL',
    },
    borderlineRangeText: {
      en: '3,500–3,999 or 11,001–12,500 cells/µL',
      hi: '3,500–3,999 या 11,001–12,500 cells/µL',
      mr: '३,५००–३,९९९ किंवा ११,००१–१२,५०० पेशी/µL',
    },
    abnormalRangeText: {
      en: '< 3,500 (Leukopenia) or > 12,500 cells/µL (Infection/Inflammation)',
      hi: '< 3,500 या > 12,500 cells/µL (संक्रमण या सूजन का संकेत)',
      mr: '< ३,५०० किंवा > १२,५०० पेशी/µL (जंतूसंसर्ग किंवा सूज)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Immune system defense cells that fight bacterial, viral, and parasitic infections.',
      hi: 'रोग प्रतिरोधक क्षमता की कोशिकाएं जो संक्रमण और बीमारियों से लड़ती हैं।',
      mr: 'शरीराची रोगप्रतिकारक शक्ती दर्शवणाऱ्या पेशी ज्या संसर्गाशी लढतात.',
    },
    clinicalTips: {
      en: 'High WBC often indicates active bacterial infection or fever; low WBC can occur in viral fevers like dengue.',
      hi: 'बढ़ा हुआ WBC संक्रमण दर्शाता है; डेंगू या वायरल बुखार में यह कम हो सकता है।',
      mr: 'वाढलेले WBC जंतूसंसर्ग दर्शवते; डेंग्यू किंवा व्हायरल तापात हे कमी होऊ शकते.',
    },
  },
  {
    id: 'platelets',
    category: 'cbc',
    name: {
      en: 'Platelet Count',
      hi: 'प्लेटलेट काउंट (Platelets)',
      mr: 'प्लेटलेट संख्या (Platelet Count)',
    },
    shortCode: 'PLT',
    unit: 'lakhs/µL',
    normalMin: 1.5,
    normalMax: 4.5,
    borderlineLow: 1.0,
    borderlineHigh: 5.0,
    normalRangeText: {
      en: '1.50 – 4.50 lakhs/µL (150,000 – 450,000 /µL)',
      hi: '1.50 – 4.50 लाख/µL (1,50,000 – 4,50,000 /µL)',
      mr: '१.५० – ४.५० लाख/µL (१,५०,००० – ४,५०,००० /µL)',
    },
    borderlineRangeText: {
      en: '1.00 – 1.49 lakhs/µL (Monitor closely in fever)',
      hi: '1.00 – 1.49 लाख/µL (बुखार में नियमित निगरानी करें)',
      mr: '१.०० – १.४९ लाख/µL (तापात नियमित लक्ष ठेवा)',
    },
    abnormalRangeText: {
      en: '< 1.00 lakh/µL (Thrombocytopenia / Dengue Alert) or > 5.00 lakhs/µL',
      hi: '< 1.00 लाख/µL (डेंगू/रक्तस्राव जोखिम) या > 5.00 लाख/µL',
      mr: '< १.०० लाख/µL (डेंग्यू/रक्तस्राव धोका) किंवा > ५.०० लाख/µL',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Blood clotting cells crucial for stopping bleeding and monitoring dengue/malaria recovery.',
      hi: 'रक्त का थक्का जमाने वाली कोशिकाएं; डेंगू और मलेरिया में अत्यंत महत्वपूर्ण।',
      mr: 'रक्त गोठण्यास मदत करणाऱ्या पेशी; डेंग्यू आणि मलेरियामध्ये अत्यंत महत्त्वाच्या.',
    },
    clinicalTips: {
      en: 'Maintain oral hydration (ORS, coconut water, kiwi, pomegranate) and consult a doctor immediately if < 1.0 lakh.',
      hi: 'पर्याप्त तरल पदार्थ (नारियल पानी, ORS) लें और 1 लाख से कम होने पर तुरंत डॉक्टर से मिलें।',
      mr: 'भरपूर द्रवपदार्थ (नारळ पाणी, ORS) घ्या आणि १ लाखापेक्षा कमी असल्यास तात्काळ डॉक्टरांचा सल्ला घ्या.',
    },
  },
  {
    id: 'rbc',
    category: 'cbc',
    name: {
      en: 'Red Blood Cell Count (RBC)',
      hi: 'लाल रक्त कोशिकाएं (RBC)',
      mr: 'लाल रक्तपेशी (RBC Count)',
    },
    shortCode: 'RBC',
    unit: 'million/µL',
    normalMin: 4.0,
    normalMax: 5.9,
    borderlineLow: 3.6,
    borderlineHigh: 6.2,
    normalRangeText: {
      en: 'Men: 4.5–5.9 million/µL | Women: 4.0–5.2 million/µL',
      hi: 'पुरुष: 4.5–5.9 million/µL | महिला: 4.0–5.2 million/µL',
      mr: 'पुरुष: ४.५–५.९ दशलक्ष/µL | महिला: ४.०–५.२ दशलक्ष/µL',
    },
    borderlineRangeText: {
      en: '3.6–3.99 million/µL',
      hi: '3.6–3.99 million/µL',
      mr: '३.६–३.९९ दशलक्ष/µL',
    },
    abnormalRangeText: {
      en: '< 3.6 million/µL or > 6.2 million/µL',
      hi: '< 3.6 million/µL या > 6.2 million/µL',
      mr: '< ३.६ दशलक्ष/µL किंवा > ६.२ दशलक्ष/µL',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Total number of red blood cells transporting oxygen from lungs to body tissues.',
      hi: 'फेफड़ों से शरीर के अंगों तक ऑक्सीजन पहुंचाने वाली लाल कोशिकाओं की संख्या।',
      mr: 'फुफ्फुसातून शरीराच्या अवयवांपर्यंत ऑक्सिजन पोहोचवणाऱ्या लाल पेशींची संख्या.',
    },
    clinicalTips: {
      en: 'Evaluated alongside Hemoglobin, MCV, and Vitamin B12/Folate levels.',
      hi: 'हीमोग्लोबिन और विटामिन B12/आयरन के साथ मिलाकर देखा जाता है।',
      mr: 'हिमोग्लोबिन आणि व्हिटॅमिन B12/लोह पातळीसोबत एकत्रितपणे तपासले जाते.',
    },
  },
  {
    id: 'pcv_hematocrit',
    category: 'cbc',
    name: {
      en: 'Packed Cell Volume (PCV / Hematocrit)',
      hi: 'पीसीवी / हेमाटोक्रिट (PCV / HCT)',
      mr: 'पीसीव्ही / हेमॅटोक्रिट (PCV / HCT)',
    },
    shortCode: 'PCV',
    unit: '%',
    normalMin: 36,
    normalMax: 50,
    borderlineLow: 33,
    borderlineHigh: 53,
    normalRangeText: {
      en: 'Men: 40%–50% | Women: 36%–46%',
      hi: 'पुरुष: 40%–50% | महिला: 36%–46%',
      mr: 'पुरुष: ४०%–५०% | महिला: ३६%–४६%',
    },
    borderlineRangeText: {
      en: '33%–35.9% or 50.1%–53%',
      hi: '33%–35.9% या 50.1%–53%',
      mr: '३३%–३५.९% किंवा ५०.१%–५३%',
    },
    abnormalRangeText: {
      en: '< 33% (Anemia) or > 53% (Dehydration / Hemoconcentration)',
      hi: '< 33% (एनीमिया) या > 53% (निर्जलीकरण / खून गाढ़ा होना)',
      mr: '< ३३% (ॲनिमिया) किंवा > ५३% (डिहायड्रेशन / रक्त घट्ट होणे)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Percentage of blood volume occupied by red blood cells.',
      hi: 'रक्त में लाल रक्त कोशिकाओं का प्रतिशत।',
      mr: 'रक्तातील लाल रक्तपेशींचे शेकडा प्रमाण.',
    },
    clinicalTips: {
      en: 'Rising PCV with falling platelets is a key warning sign in dengue fever requiring fluid therapy.',
      hi: 'डेंगू में प्लेटलेट कम होना और PCV बढ़ना शरीर में पानी की कमी का संकेत है।',
      mr: 'डेंग्यूमध्ये प्लेटलेट्स कमी होणे आणि PCV वाढणे हे शरीरात पाणी कमी झाल्याचे लक्षण आहे.',
    },
  },
  {
    id: 'esr',
    category: 'cbc',
    name: {
      en: 'ESR (Erythrocyte Sedimentation Rate)',
      hi: 'ईएसआर (ESR - सूजन व संक्रमण जांच)',
      mr: 'ईएसआर (ESR - शरीरातील सूज तपासणी)',
    },
    shortCode: 'ESR',
    unit: 'mm/hr',
    normalMin: 0,
    normalMax: 20,
    borderlineHigh: 35,
    normalRangeText: {
      en: 'Men: 0–15 mm/hr | Women & Seniors: 0–20 mm/hr',
      hi: 'पुरुष: 0–15 mm/hr | महिला व वरिष्ठ: 0–20 mm/hr',
      mr: 'पुरुष: ०–१५ mm/hr | महिला व ज्येष्ठ: ०–२० mm/hr',
    },
    borderlineRangeText: {
      en: '21 – 35 mm/hr (Mild Inflammation)',
      hi: '21 – 35 mm/hr (हल्की सूजन)',
      mr: '२१ – ३५ mm/hr (सौम्य सूज)',
    },
    abnormalRangeText: {
      en: '> 35 mm/hr (Chronic Infection, Arthritis, or Autoimmune inflammation)',
      hi: '> 35 mm/hr (पुराना संक्रमण, गठिया या सूजन)',
      mr: '> ३५ mm/hr (जुनाट संसर्ग, संधिवात किंवा सूज)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Rate at which red blood cells settle in 1 hour; non-specific marker of inflammation.',
      hi: 'शरीर में किसी भी प्रकार की अंदरूनी सूजन, गठिया या पुराने संक्रमण का संकेत।',
      mr: 'शरीरातील अंतर्गत सूज, संधिवात किंवा जुनाट संसर्ग दर्शवणारी चाचणी.',
    },
    clinicalTips: {
      en: 'Useful for tracking joint inflammation (arthritis), tuberculosis recovery, and chronic infections.',
      hi: 'जोड़ों के दर्द (गठिया) और टीबी जैसी बीमारियों में सुधार देखने के लिए उपयोगी।',
      mr: 'सांधेदुखी (संधिवात) आणि टीबी सारख्या आजारांमधील सुधारणा पाहण्यासाठी उपयुक्त.',
    },
  },

  // 2. Diabetes & Blood Sugar
  {
    id: 'fbs',
    category: 'diabetes',
    name: {
      en: 'Fasting Blood Sugar (FBS)',
      hi: 'फास्टिंग ब्लड शुगर (खाली पेट शुगर)',
      mr: 'फास्टिंग ब्लड शुगर (उपाशीपोटी शुगर)',
    },
    shortCode: 'FBS',
    unit: 'mg/dL',
    normalMin: 70,
    normalMax: 99,
    borderlineLow: 60,
    borderlineHigh: 125,
    normalRangeText: {
      en: '70 – 99 mg/dL (Normal Fasting)',
      hi: '70 – 99 mg/dL (सामान्य खाली पेट)',
      mr: '७० – ९९ mg/dL (सामान्य उपाशीपोटी)',
    },
    borderlineRangeText: {
      en: '100 – 125 mg/dL (Prediabetes / Impaired Fasting Glucose)',
      hi: '100 – 125 mg/dL (प्री-डायबिटीज / बॉर्डरलाइन)',
      mr: '१०० – १२५ mg/dL (प्री-डायबिटीज / बॉर्डरलाईन)',
    },
    abnormalRangeText: {
      en: '< 70 mg/dL (Hypoglycemia) or ≥ 126 mg/dL (Diabetes)',
      hi: '< 70 mg/dL (लो शुगर) या ≥ 126 mg/dL (मधुमेह)',
      mr: '< ७० mg/dL (कमी शुगर) किंवा ≥ १२६ mg/dL (मधुमेह)',
    },
    fastingRequired: true,
    whatItMeasures: {
      en: 'Baseline blood glucose level after 8–10 hours of overnight fasting.',
      hi: 'रात भर (8–10 घंटे) खाली पेट रहने के बाद रक्त में ग्लूकोज का स्तर।',
      mr: 'रात्रभर (८–१० तास) उपाशीपोटी राहिल्यानंतर रक्तातील साखरेचे प्रमाण.',
    },
    clinicalTips: {
      en: 'Do not consume tea, coffee, or food for 8–10 hours before the test; plain water is allowed.',
      hi: 'जांच से 8–10 घंटे पहले चाय, कॉफी या भोजन न लें; केवल सादा पानी पी सकते हैं।',
      mr: 'चाचणीपूर्वी ८–१० तास चहा, कॉफी किंवा अन्न घेऊ नका; फक्त साधे पाणी पिऊ शकता.',
    },
  },
  {
    id: 'ppbs',
    category: 'diabetes',
    name: {
      en: 'Post-Prandial Blood Sugar (PPBS)',
      hi: 'पोस्ट-प्रैंडियल शुगर (भोजन के 2 घंटे बाद)',
      mr: 'जेवणानंतरची शुगर (PPBS - २ तासांनंतर)',
    },
    shortCode: 'PPBS',
    unit: 'mg/dL',
    normalMin: 80,
    normalMax: 140,
    borderlineLow: 70,
    borderlineHigh: 199,
    normalRangeText: {
      en: '< 140 mg/dL (2 hours after meal)',
      hi: '< 140 mg/dL (भोजन के 2 घंटे बाद)',
      mr: '< १४० mg/dL (जेवणाच्या २ तासांनंतर)',
    },
    borderlineRangeText: {
      en: '140 – 199 mg/dL (Prediabetes / Impaired Glucose Tolerance)',
      hi: '140 – 199 mg/dL (प्री-डायबिटीज)',
      mr: '१४० – १९९ mg/dL (प्री-डायबिटीज)',
    },
    abnormalRangeText: {
      en: '≥ 200 mg/dL (Diabetes Mellitus)',
      hi: '≥ 200 mg/dL (मधुमेह / डायबिटीज)',
      mr: '≥ २०० mg/dL (मधुमेह / डायबिटीज)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'How effectively insulin clears glucose from the blood exactly 2 hours after starting a meal.',
      hi: 'भोजन शुरू करने के ठीक 2 घंटे बाद शरीर इंसुलिन की मदद से शुगर को कैसे नियंत्रित करता है।',
      mr: 'जेवण सुरू केल्याच्या बरोबर २ तासांनंतर शरीर साखरेचे नियंत्रण कसे करते हे मोजते.',
    },
    clinicalTips: {
      en: 'A 15-minute gentle walk after lunch/dinner significantly improves post-meal glucose spikes.',
      hi: 'भोजन के बाद 15 मिनट की हल्की सैर खाने के बाद बढ़ने वाली शुगर को नियंत्रित रखती है।',
      mr: 'जेवणानंतर १५ मिनिटे शतपावली केल्याने रक्तातील साखर नियंत्रणात राहण्यास मदत होते.',
    },
  },
  {
    id: 'hba1c',
    category: 'diabetes',
    name: {
      en: 'HbA1c (Glycosylated Hemoglobin)',
      hi: 'एचबीए1सी (HbA1c - 3 महीने की औसत शुगर)',
      mr: 'एचबीए१सी (HbA1c - ३ महिन्यांची सरासरी शुगर)',
    },
    shortCode: 'HbA1c',
    unit: '%',
    normalMin: 4.0,
    normalMax: 5.6,
    borderlineHigh: 6.4,
    normalRangeText: {
      en: 'Below 5.7% (Normal 3-Month Average)',
      hi: '5.7% से कम (सामान्य 3 महीने का औसत)',
      mr: '५.७% पेक्षा कमी (सामान्य ३ महिन्यांची सरासरी)',
    },
    borderlineRangeText: {
      en: '5.7% – 6.4% (Prediabetes)',
      hi: '5.7% – 6.4% (प्री-डायबिटीज)',
      mr: '५.७% – ६.४% (प्री-डायबिटीज)',
    },
    abnormalRangeText: {
      en: '≥ 6.5% (Diabetes | Target for diabetics: < 7.0%)',
      hi: '≥ 6.5% (मधुमेह | डायबिटीज रोगियों के लिए लक्ष्य: < 7.0%)',
      mr: '≥ ६.५% (मधुमेह | मधुमेहींसाठी नियंत्रित लक्ष्य: < ७.०%)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Average blood glucose attached to hemoglobin over the past 8 to 12 weeks.',
      hi: 'पिछले 3 महीनों (8–12 सप्ताह) के दौरान रक्त में औसत शुगर का स्तर।',
      mr: 'मागील ३ महिन्यांतील (८–१२ आठवडे) रक्तातील साखरेची सरासरी पातळी.',
    },
    clinicalTips: {
      en: 'Recommended every 3–6 months for diabetic patients and annually after age 40.',
      hi: 'मधुमेह रोगियों को हर 3–6 महीने में और 40 की उम्र के बाद साल में एक बार कराना चाहिए।',
      mr: 'मधुमेह असलेल्यांनी दर ३–६ महिन्यांनी आणि वयाच्या ४० नंतर वर्षातून एकदा ही चाचणी करावी.',
    },
  },
  {
    id: 'rbs',
    category: 'diabetes',
    name: {
      en: 'Random Blood Sugar (RBS)',
      hi: 'रैंडम ब्लड शुगर (RBS - किसी भी समय)',
      mr: 'रँडम ब्लड शुगर (RBS - कोणत्याही वेळी)',
    },
    shortCode: 'RBS',
    unit: 'mg/dL',
    normalMin: 70,
    normalMax: 140,
    borderlineLow: 65,
    borderlineHigh: 199,
    normalRangeText: {
      en: '70 – 140 mg/dL (Anytime during day)',
      hi: '70 – 140 mg/dL (दिन में किसी भी समय)',
      mr: '७० – १४० mg/dL (दिवसातून कोणत्याही वेळी)',
    },
    borderlineRangeText: {
      en: '141 – 199 mg/dL (Check Fasting & HbA1c)',
      hi: '141 – 199 mg/dL (फास्टिंग और HbA1c जांच कराएं)',
      mr: '१४१ – १९९ mg/dL (फास्टिंग आणि HbA1c तपासा)',
    },
    abnormalRangeText: {
      en: '< 70 mg/dL (Low Sugar) or ≥ 200 mg/dL (High Sugar Alert)',
      hi: '< 70 mg/dL (लो शुगर) या ≥ 200 mg/dL (हाई शुगर)',
      mr: '< ७० mg/dL (कमी शुगर) किंवा ≥ २०० mg/dL (जास्त शुगर)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Immediate capillary or venous blood glucose check regardless of meal timing.',
      hi: 'भोजन के समय की परवाह किए बिना तुरंत शुगर की जांच (ग्लूकोमीटर या लैब द्वारा)।',
      mr: 'जेवणाच्या वेळेचा विचार न करता तात्काळ केली जाणारी रक्तातील साखरेची चाचणी.',
    },
    clinicalTips: {
      en: 'If RBS is < 70 mg/dL with sweating or dizziness, immediately take 15g glucose or 3 teaspoons of sugar in water.',
      hi: 'यदि शुगर 70 से कम हो और पसीना या चक्कर आए, तो तुरंत ग्लूकोज या चीनी का पानी लें।',
      mr: 'शुगर ७० पेक्षा कमी असल्यास आणि घाम किंवा चक्कर आल्यास तात्काळ ग्लुकोज किंवा साखरेचे पाणी घ्या.',
    },
  },

  // 3. Lipid Profile (Heart & Cholesterol)
  {
    id: 'total_cholesterol',
    category: 'lipid',
    name: {
      en: 'Total Cholesterol',
      hi: 'कुल कोलेस्ट्रॉल (Total Cholesterol)',
      mr: 'एकूण कोलेस्ट्रॉल (Total Cholesterol)',
    },
    shortCode: 'CHOL',
    unit: 'mg/dL',
    normalMin: 120,
    normalMax: 199,
    borderlineHigh: 239,
    normalRangeText: {
      en: '< 200 mg/dL (Desirable)',
      hi: '< 200 mg/dL (सामान्य व सुरक्षित)',
      mr: '< २०० mg/dL (सामान्य व सुरक्षित)',
    },
    borderlineRangeText: {
      en: '200 – 239 mg/dL (Borderline High)',
      hi: '200 – 239 mg/dL (बॉर्डरलाइन हाई)',
      mr: '२०० – २३९ mg/dL (सीमारेषेवर जास्त)',
    },
    abnormalRangeText: {
      en: '≥ 240 mg/dL (High Cardiovascular Risk)',
      hi: '≥ 240 mg/dL (उच्च कोलेस्ट्रॉल - हृदय जोखिम)',
      mr: '≥ २४० mg/dL (उच्च कोलेस्ट्रॉल - हृदयविकाराचा धोका)',
    },
    fastingRequired: true,
    whatItMeasures: {
      en: 'Combined sum of LDL, HDL, and VLDL cholesterol circulating in blood.',
      hi: 'रक्त में मौजूद अच्छे (HDL) और बुरे (LDL) कोलेस्ट्रॉल की कुल मात्रा।',
      mr: 'रक्तातील चांगले (HDL) आणि वाईट (LDL) कोलेस्ट्रॉलचे एकूण प्रमाण.',
    },
    clinicalTips: {
      en: 'Reduce deep-fried snacks, trans fats, and excess ghee; increase oats, flaxseeds, walnuts, and brisk walking.',
      hi: 'तली-भुनी चीजों और वनस्पति घी से बचें; ओट्स, अलसी, अखरोट और पैदल चलने को अपनाएं।',
      mr: 'तळलेले पदार्थ आणि डालडा टाळा; ओट्स, जवस, अक्रोड आणि नियमित चालण्याचा सराव ठेवा.',
    },
  },
  {
    id: 'ldl_cholesterol',
    category: 'lipid',
    name: {
      en: 'LDL Cholesterol ("Bad" Cholesterol)',
      hi: 'एलडीएल कोलेस्ट्रॉल (LDL - बुरा कोलेस्ट्रॉल)',
      mr: 'एलडीएल कोलेस्ट्रॉल (LDL - वाईट कोलेस्ट्रॉल)',
    },
    shortCode: 'LDL',
    unit: 'mg/dL',
    normalMin: 40,
    normalMax: 99,
    borderlineHigh: 159,
    normalRangeText: {
      en: '< 100 mg/dL (Optimal | Heart/Diabetes patients: < 70 mg/dL)',
      hi: '< 100 mg/dL (उत्तम | हृदय/मधुमेह रोगियों के लिए: < 70 mg/dL)',
      mr: '< १०० mg/dL (उत्तम | हृदय/मधुमेह रुग्णांसाठी: < ७० mg/dL)',
    },
    borderlineRangeText: {
      en: '100 – 159 mg/dL (Near Optimal to Borderline High)',
      hi: '100 – 159 mg/dL (सामान्य से थोड़ा अधिक / बॉर्डरलाइन)',
      mr: '१०० – १५९ mg/dL (सामान्यापेक्षा थोडे जास्त / बॉर्डरलाईन)',
    },
    abnormalRangeText: {
      en: '≥ 160 mg/dL (High / Plaque Buildup Risk)',
      hi: '≥ 160 mg/dL (उच्च जोखिम - धमनियों में रुकावट का खतरा)',
      mr: '≥ १६० mg/dL (उच्च धोका - रक्तवाहिन्यांमध्ये अडथळ्याचा धोका)',
    },
    fastingRequired: true,
    whatItMeasures: {
      en: 'Low-density lipoprotein that deposits cholesterol plaque inside heart and brain arteries.',
      hi: 'हृदय और मस्तिष्क की धमनियों में जमा होकर ब्लॉकेज पैदा करने वाला कोलेस्ट्रॉल।',
      mr: 'हृदय आणि मेंदूच्या रक्तवाहिन्यांमध्ये साचून ब्लॉकेज निर्माण करणारे कोलेस्ट्रॉल.',
    },
    clinicalTips: {
      en: 'Soluble fiber (barley, oats, apples, beans) helps bind and remove excess LDL naturally.',
      hi: 'फाइबर युक्त आहार (जौ, ओट्स, सेब, दालें) LDL को कम करने में मदद करता है।',
      mr: 'तंतुमय आहार (जव, ओट्स, सफरचंद, कडधान्ये) LDL नैसर्गिकरीत्या कमी करण्यास मदत करतो.',
    },
  },
  {
    id: 'hdl_cholesterol',
    category: 'lipid',
    name: {
      en: 'HDL Cholesterol ("Good" Cholesterol)',
      hi: 'एचडीएल कोलेस्ट्रॉल (HDL - अच्छा कोलेस्ट्रॉल)',
      mr: 'एचडीएल कोलेस्ट्रॉल (HDL - चांगले कोलेस्ट्रॉल)',
    },
    shortCode: 'HDL',
    unit: 'mg/dL',
    normalMin: 45,
    normalMax: 90,
    borderlineLow: 40,
    normalRangeText: {
      en: 'Men: > 40 mg/dL | Women: > 50 mg/dL (≥ 60 mg/dL is Heart Protective)',
      hi: 'पुरुष: > 40 mg/dL | महिला: > 50 mg/dL (≥ 60 mg/dL हृदय रक्षक)',
      mr: 'पुरुष: > ४० mg/dL | महिला: > ५० mg/dL (≥ ६० mg/dL हृदय रक्षक)',
    },
    borderlineRangeText: {
      en: '40 – 44 mg/dL',
      hi: '40 – 44 mg/dL',
      mr: '४० – ४४ mg/dL',
    },
    abnormalRangeText: {
      en: '< 40 mg/dL (Low HDL - Increased Heart Risk)',
      hi: '< 40 mg/dL (कम HDL - हृदय रोग का जोखिम)',
      mr: '< ४० mg/dL (कमी HDL - हृदयविकाराचा धोका)',
    },
    fastingRequired: true,
    whatItMeasures: {
      en: 'High-density lipoprotein that clears bad cholesterol from arteries back to the liver.',
      hi: 'धमनियों से बुरे कोलेस्ट्रॉल को साफ करके लिवर तक ले जाने वाला सुरक्षात्मक कोलेस्ट्रॉल।',
      mr: 'रक्तवाहिन्यांमधील वाईट कोलेस्ट्रॉल साफ करून यकृताकडे नेणारे संरक्षणात्मक कोलेस्ट्रॉल.',
    },
    clinicalTips: {
      en: '30 minutes of daily aerobic exercise, quitting tobacco, and eating almonds/walnuts boost HDL.',
      hi: 'रोजाना 30 मिनट तेज चलना, तंबाकू छोड़ना और बादाम/अखरोट का सेवन HDL बढ़ाता है।',
      mr: 'दररोज ३० मिनिटे जलद चालणे, तंबाखू सोडणे आणि बदाम/अक्रोड खाल्ल्याने HDL वाढते.',
    },
  },
  {
    id: 'triglycerides',
    category: 'lipid',
    name: {
      en: 'Triglycerides (TG)',
      hi: 'ट्राइग्लिसराइड्स (Triglycerides - रक्त में वसा)',
      mr: 'ट्रायग्लिसराइड्स (Triglycerides - रक्तातील चरबी)',
    },
    shortCode: 'TG',
    unit: 'mg/dL',
    normalMin: 40,
    normalMax: 149,
    borderlineHigh: 199,
    normalRangeText: {
      en: '< 150 mg/dL (Normal)',
      hi: '< 150 mg/dL (सामान्य)',
      mr: '< १५० mg/dL (सामान्य)',
    },
    borderlineRangeText: {
      en: '150 – 199 mg/dL (Borderline High)',
      hi: '150 – 199 mg/dL (बॉर्डरलाइन हाई)',
      mr: '१५० – १९९ mg/dL (बॉर्डरलाईन जास्त)',
    },
    abnormalRangeText: {
      en: '≥ 200 mg/dL (High) | ≥ 500 mg/dL (Very High - Pancreatitis Risk)',
      hi: '≥ 200 mg/dL (उच्च) | ≥ 500 mg/dL (अत्यधिक उच्च)',
      mr: '≥ २०० mg/dL (जास्त) | ≥ ५०० mg/dL (अतिशय जास्त)',
    },
    fastingRequired: true,
    whatItMeasures: {
      en: 'Blood fats formed from excess calories, sugar, refined carbohydrates, and alcohol.',
      hi: 'अतिरिक्त चीनी, मैदा, चावल और तेल से बनने वाला रक्त वसा (फैट)।',
      mr: 'अतिरिक्त साखर, मैदा, भात आणि तेलापासून तयार होणारी रक्तातील चरबी.',
    },
    clinicalTips: {
      en: '10–12 hours fasting is essential before testing TG. Cut down sugary drinks, sweets, and white flour.',
      hi: 'जांच से पहले 10–12 घंटे खाली पेट रहें। मीठे पेय, मिठाई और मैदे से परहेज करें।',
      mr: 'चाचणीपूर्वी १०–१२ तास उपाशी राहणे गरजेचे आहे. गोड पेये, मिठाई आणि मैदा टाळा.',
    },
  },
  {
    id: 'vldl',
    category: 'lipid',
    name: {
      en: 'VLDL Cholesterol',
      hi: 'वीएलडीएल कोलेस्ट्रॉल (VLDL)',
      mr: 'व्हीएलडीएल कोलेस्ट्रॉल (VLDL)',
    },
    shortCode: 'VLDL',
    unit: 'mg/dL',
    normalMin: 2,
    normalMax: 30,
    borderlineHigh: 40,
    normalRangeText: {
      en: '2 – 30 mg/dL',
      hi: '2 – 30 mg/dL',
      mr: '२ – ३० mg/dL',
    },
    borderlineRangeText: {
      en: '31 – 40 mg/dL',
      hi: '31 – 40 mg/dL',
      mr: '३१ – ४० mg/dL',
    },
    abnormalRangeText: {
      en: '> 40 mg/dL (Elevated Triglyceride Carrier)',
      hi: '> 40 mg/dL (अधिक वसा वाहक)',
      mr: '> ४० mg/dL (जास्त चरबी वाहक)',
    },
    fastingRequired: true,
    whatItMeasures: {
      en: 'Very-low-density lipoprotein that carries triglycerides to tissues (roughly TG ÷ 5).',
      hi: 'रक्त में ट्राइग्लिसराइड्स ले जाने वाला कोलेस्ट्रॉल (लगभग TG का पांचवां हिस्सा)।',
      mr: 'रक्तात ट्रायग्लिसराइड्स वाहून नेणारे कोलेस्ट्रॉल (साधारणपणे TG च्या १/५ प्रमाण).',
    },
    clinicalTips: {
      en: 'Controlling blood sugar and triglycerides automatically normalizes VLDL.',
      hi: 'शुगर और ट्राइग्लिसराइड्स नियंत्रित रखने से VLDL स्वतः सामान्य हो जाता है।',
      mr: 'शुगर आणि ट्रायग्लिसराइड्स नियंत्रित ठेवल्यास VLDL आपोआप सामान्य होते.',
    },
  },

  // 4. Kidney (KFT) & Liver (LFT)
  {
    id: 'creatinine',
    category: 'kidney_liver',
    name: {
      en: 'Serum Creatinine (Kidney Function)',
      hi: 'सीरम क्रिएटिनिन (किडनी कार्य क्षमता)',
      mr: 'सीरम क्रिएटिनिन (किडनी कार्यक्षमता)',
    },
    shortCode: 'CREAT',
    unit: 'mg/dL',
    normalMin: 0.6,
    normalMax: 1.2,
    borderlineLow: 0.5,
    borderlineHigh: 1.4,
    normalRangeText: {
      en: 'Men: 0.7–1.3 mg/dL | Women: 0.6–1.1 mg/dL',
      hi: 'पुरुष: 0.7–1.3 mg/dL | महिला: 0.6–1.1 mg/dL',
      mr: 'पुरुष: ०.७–१.३ mg/dL | महिला: ०.६–१.१ mg/dL',
    },
    borderlineRangeText: {
      en: '1.21 – 1.40 mg/dL (Mild Renal Strain / Dehydration)',
      hi: '1.21 – 1.40 mg/dL (हल्का किडनी दबाव या पानी की कमी)',
      mr: '१.२१ – १.४० mg/dL (किडनीवर सौम्य ताण किंवा पाण्याची कमतरता)',
    },
    abnormalRangeText: {
      en: '> 1.4 mg/dL (Impaired Kidney Filtration - Consult Nephrologist/Physician)',
      hi: '> 1.4 mg/dL (किडनी फिल्ट्रेशन में कमी - डॉक्टर से मिलें)',
      mr: '> १.४ mg/dL (किडनीच्या गाळण प्रक्रियेत घट - डॉक्टरांचा सल्ला घ्या)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Muscle waste product filtered exclusively by the kidneys; primary indicator of renal health.',
      hi: 'किडनी द्वारा छानकर बाहर निकाला जाने वाला अपशिष्ट; किडनी स्वास्थ्य की मुख्य जांच।',
      mr: 'किडनीद्वारे गाळून बाहेर टाकले जाणारे घटक; किडनीच्या आरोग्याची मुख्य चाचणी.',
    },
    clinicalTips: {
      en: 'Avoid overuse of painkillers (NSAIDs), control BP/diabetes, and stay well hydrated.',
      hi: 'दर्द निवारक दवाओं (पेनकिलर) के अधिक सेवन से बचें और बीपी व शुगर नियंत्रित रखें।',
      mr: 'पेनकिलर गोळ्यांचा अतिवापर टाळा आणि रक्तदाब व मधुमेह नियंत्रणात ठेवा.',
    },
  },
  {
    id: 'egfr',
    category: 'kidney_liver',
    name: {
      en: 'eGFR (Estimated Glomerular Filtration Rate)',
      hi: 'ईजीएफआर (eGFR - किडनी फिल्टर दर)',
      mr: 'ईजीएफआर (eGFR - किडनी गाळण दर)',
    },
    shortCode: 'eGFR',
    unit: 'mL/min',
    normalMin: 90,
    normalMax: 130,
    borderlineLow: 60,
    normalRangeText: {
      en: '≥ 90 mL/min/1.73m² (Normal Kidney Filtration)',
      hi: '≥ 90 mL/min/1.73m² (सामान्य किडनी कार्य)',
      mr: '≥ ९० mL/min/1.73m² (सामान्य किडनी कार्य)',
    },
    borderlineRangeText: {
      en: '60 – 89 mL/min (Mildly Decreased - Normal in Older Seniors)',
      hi: '60 – 89 mL/min (हल्की कमी - वरिष्ठ नागरिकों में सामान्य हो सकता है)',
      mr: '६० – ८९ mL/min (सौम्य घट - ज्येष्ठ नागरिकांमध्ये सामान्य असू शकते)',
    },
    abnormalRangeText: {
      en: '< 60 mL/min (Chronic Kidney Disease Stage 3+ Alert)',
      hi: '< 60 mL/min (किडनी कार्य क्षमता में कमी)',
      mr: '< ६० mL/min (किडनीच्या कार्यक्षमतेत लक्षणीय घट)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Calculated rate of blood filtered by kidneys per minute based on Creatinine, Age, and Sex.',
      hi: 'किडनी प्रति मिनट कितना रक्त साफ करती है, इसका प्रतिशत माप।',
      mr: 'किडनी प्रति मिनिट किती रक्त शुद्ध करते याचे मोजमाप.',
    },
    clinicalTips: {
      en: 'Annual eGFR & Urine Microalbumin checks are vital for everyone with hypertension or diabetes.',
      hi: 'उच्च रक्तचाप और मधुमेह रोगियों को साल में एक बार eGFR जांच अवश्य करानी चाहिए।',
      mr: 'उच्च रक्तदाब आणि मधुमेह असलेल्यांनी वर्षातून एकदा eGFR तपासणी नक्की करावी.',
    },
  },
  {
    id: 'blood_urea',
    category: 'kidney_liver',
    name: {
      en: 'Blood Urea & BUN',
      hi: 'ब्लड यूरिया (Blood Urea)',
      mr: 'ब्लड युरिया (Blood Urea)',
    },
    shortCode: 'UREA',
    unit: 'mg/dL',
    normalMin: 15,
    normalMax: 40,
    borderlineLow: 10,
    borderlineHigh: 50,
    normalRangeText: {
      en: 'Blood Urea: 15 – 40 mg/dL (BUN: 7 – 20 mg/dL)',
      hi: 'ब्लड यूरिया: 15 – 40 mg/dL (BUN: 7 – 20 mg/dL)',
      mr: 'ब्लड युरिया: १५ – ४० mg/dL (BUN: ७ – २० mg/dL)',
    },
    borderlineRangeText: {
      en: '41 – 50 mg/dL (Often due to dehydration or high-protein diet)',
      hi: '41 – 50 mg/dL (पानी की कमी या अधिक प्रोटीन से हो सकता है)',
      mr: '४१ – ५० mg/dL (पाण्याची कमतरता किंवा जास्त प्रथिनांमुळे होऊ शकते)',
    },
    abnormalRangeText: {
      en: '> 50 mg/dL (Elevated Renal Nitrogen Waste)',
      hi: '> 50 mg/dL (किडनी पर दबाव का संकेत)',
      mr: '> ५० mg/dL (किडनीवर ताण असल्याचा संकेत)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Protein metabolism waste cleared by kidneys.',
      hi: 'प्रोटीन पाचन के बाद बनने वाला तत्व जिसे किडनी बाहर निकालती है।',
      mr: 'प्रथिनांच्या पचनानंतर तयार होणारा घटक जो किडनी शरीराबाहेर टाकते.',
    },
    clinicalTips: {
      en: 'Drink adequate water daily unless your doctor has advised fluid restriction.',
      hi: 'प्रतिदिन पर्याप्त पानी पिएं (जब तक डॉक्टर ने पानी कम पीने की सलाह न दी हो)।',
      mr: 'दररोज पुरेसे पाणी प्या (डॉक्टरांनी पाणी कमी पिण्याचा सल्ला दिला नसल्यास).',
    },
  },
  {
    id: 'uric_acid',
    category: 'kidney_liver',
    name: {
      en: 'Serum Uric Acid',
      hi: 'यूरिक एसिड (Uric Acid - जोड़ों का दर्द)',
      mr: 'युरिक ॲसिड (Uric Acid - सांधेदुखी)',
    },
    shortCode: 'UA',
    unit: 'mg/dL',
    normalMin: 3.0,
    normalMax: 7.0,
    borderlineHigh: 7.8,
    normalRangeText: {
      en: 'Men: 3.4–7.0 mg/dL | Women: 2.4–6.0 mg/dL',
      hi: 'पुरुष: 3.4–7.0 mg/dL | महिला: 2.4–6.0 mg/dL',
      mr: 'पुरुष: ३.४–७.० mg/dL | महिला: २.४–६.० mg/dL',
    },
    borderlineRangeText: {
      en: '7.1 – 7.8 mg/dL (Mild Hyperuricemia)',
      hi: '7.1 – 7.8 mg/dL (हल्का बढ़ा हुआ यूरिक एसिड)',
      mr: '७.१ – ७.८ mg/dL (सौम्य वाढलेले युरिक ॲसिड)',
    },
    abnormalRangeText: {
      en: '> 7.8 mg/dL (Gouty Arthritis & Kidney Stone Risk)',
      hi: '> 7.8 mg/dL (गाउट / जोड़ों में सूजन और पथरी का जोखिम)',
      mr: '> ७.८ mg/dL (गाऊट / सांध्यांना सूज आणि मूतखड्याचा धोका)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Purine breakdown product that can crystallize in toe/ankle joints and kidneys.',
      hi: 'प्यूरीन के टूटने से बनने वाला तत्व जो जोड़ों (विशेषकर पैर के अंगूठे व एड़ी) में दर्द करता है।',
      mr: 'प्युरीनच्या विघटनातून तयार होणारा घटक जो सांध्यांमध्ये (विशेषतः पायाच्या अंगठ्यात व टाचेत) दुखणे निर्माण करतो.',
    },
    clinicalTips: {
      en: 'Drink 2.5–3L water daily; limit red meat, organ meats, sugary sodas, and excess alcohol.',
      hi: 'खूब पानी पिएं; मीठे कोल्ड ड्रिंक्स, रेड मीट और अधिक दाल/पालक (यदि दर्द हो) सीमित करें।',
      mr: 'भरपूर पाणी प्या; गोड शीतपेये, मांसाहार आणि अल्कोहोल टाळा.',
    },
  },
  {
    id: 'bilirubin_total',
    category: 'kidney_liver',
    name: {
      en: 'Total Bilirubin (Jaundice Test)',
      hi: 'कुल बिलीरुबिन (Bilirubin - पीलिया जांच)',
      mr: 'एकूण बिलीरुबिन (Bilirubin - कावीळ चाचणी)',
    },
    shortCode: 'TBIL',
    unit: 'mg/dL',
    normalMin: 0.2,
    normalMax: 1.2,
    borderlineHigh: 1.8,
    normalRangeText: {
      en: '0.2 – 1.2 mg/dL (Direct Bilirubin: 0.0 – 0.3 mg/dL)',
      hi: '0.2 – 1.2 mg/dL (डायरेक्ट बिलीरुबिन: 0.0 – 0.3 mg/dL)',
      mr: '०.२ – १.२ mg/dL (डायरेक्ट बिलीरुबिन: ०.० – ०.३ mg/dL)',
    },
    borderlineRangeText: {
      en: '1.3 – 1.8 mg/dL (Mild Elevation)',
      hi: '1.3 – 1.8 mg/dL (हल्की वृद्धि)',
      mr: '१.३ – १.८ mg/dL (सौम्य वाढ)',
    },
    abnormalRangeText: {
      en: '> 1.8 mg/dL (Jaundice / Hepatitis / Bile Duct Issue)',
      hi: '> 1.8 mg/dL (पीलिया / लिवर सूजन का संकेत)',
      mr: '> १.८ mg/dL (कावीळ / यकृताच्या विकाराचा संकेत)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Yellow pigment processed by the liver; high levels cause yellowing of eyes and dark urine.',
      hi: 'लिवर द्वारा प्रोसेस किया जाने वाला पीला तत्व; बढ़ने पर आंखें और पेशाब पीले हो जाते हैं।',
      mr: 'यकृताद्वारे प्रक्रिया केलेला पिवळा घटक; वाढल्यास डोळे व लघवी पिवळी होते (कावीळ).',
    },
    clinicalTips: {
      en: 'Always drink boiled/filtered water and avoid street food and alcohol to protect liver health.',
      hi: 'पीलिया से बचाव के लिए हमेशा स्वच्छ/उबला पानी पिएं और बाहर के खुले भोजन से बचें।',
      mr: 'काविळीपासून संरक्षणासाठी नेहमी शुद्ध/उकळलेले पाणी प्या आणि उघड्यावरील अन्न टाळा.',
    },
  },
  {
    id: 'sgpt_sgot',
    category: 'kidney_liver',
    name: {
      en: 'Liver Enzymes: SGPT (ALT) & SGOT (AST)',
      hi: 'लिवर एंजाइम: SGPT (ALT) और SGOT (AST)',
      mr: 'लिव्हर एन्झाईम्स: SGPT (ALT) आणि SGOT (AST)',
    },
    shortCode: 'SGPT',
    unit: 'U/L',
    normalMin: 7,
    normalMax: 45,
    borderlineHigh: 80,
    normalRangeText: {
      en: 'SGPT (ALT): 7–45 U/L | SGOT (AST): 8–40 U/L',
      hi: 'SGPT (ALT): 7–45 U/L | SGOT (AST): 8–40 U/L',
      mr: 'SGPT (ALT): ७–४५ U/L | SGOT (AST): ८–४० U/L',
    },
    borderlineRangeText: {
      en: '46 – 80 U/L (Mild Fatty Liver or Medication Effect)',
      hi: '46 – 80 U/L (फैटी लिवर या दवाओं का हल्का असर)',
      mr: '४६ – ८० U/L (फॅटी लिव्हर किंवा औषधांचा सौम्य परिणाम)',
    },
    abnormalRangeText: {
      en: '> 80 U/L (Liver Inflammation / Hepatitis)',
      hi: '> 80 U/L (लिवर में सूजन / हेपेटाइटिस)',
      mr: '> ८० U/L (यकृतावर सूज / हेपेटायटिस)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Enzymes inside liver cells that leak into blood when the liver is stressed or inflamed.',
      hi: 'लिवर कोशिकाओं के एंजाइम जो फैटी लिवर या लिवर सूजन होने पर रक्त में बढ़ जाते हैं।',
      mr: 'यकृताच्या पेशींमधील एन्झाईम्स जे फॅटी लिव्हर किंवा यकृताला सूज आल्यास रक्तात वाढतात.',
    },
    clinicalTips: {
      en: 'Weight management, daily walking, and avoiding sugary foods reverse Grade-1 Fatty Liver.',
      hi: 'नियमित व्यायाम, वजन नियंत्रण और मीठा व तला भोजन कम करने से फैटी लिवर ठीक होता है।',
      mr: 'नियमित व्यायाम, वजन नियंत्रण आणि गोड व तळलेले पदार्थ कमी केल्याने फॅटी लिव्हर सुधारतो.',
    },
  },

  // 5. Thyroid, Vitamins & Minerals
  {
    id: 'tsh',
    category: 'thyroid_vitamins',
    name: {
      en: 'TSH (Thyroid Stimulating Hormone)',
      hi: 'टीएसएच (TSH - थायरॉइड हार्मोन जांच)',
      mr: 'टीएसएच (TSH - थायरॉइड संप्रेरक चाचणी)',
    },
    shortCode: 'TSH',
    unit: 'µIU/mL',
    normalMin: 0.45,
    normalMax: 4.5,
    borderlineLow: 0.2,
    borderlineHigh: 10.0,
    normalRangeText: {
      en: '0.45 – 4.50 µIU/mL (Total T3: 80–200 ng/dL | Total T4: 5.0–12.0 µg/dL)',
      hi: '0.45 – 4.50 µIU/mL (T3: 80–200 ng/dL | T4: 5.0–12.0 µg/dL)',
      mr: '०.४५ – ४.५० µIU/mL (T3: ८०–२०० ng/dL | T4: ५.०–१२.० µg/dL)',
    },
    borderlineRangeText: {
      en: '4.51 – 10.0 µIU/mL (Subclinical Hypothyroidism)',
      hi: '4.51 – 10.0 µIU/mL (सबक्लिनिकल हाइपोथायरायडिज्म)',
      mr: '४.५१ – १०.० µIU/mL (सौम्य हायपोथायरॉईडीझम)',
    },
    abnormalRangeText: {
      en: '< 0.45 µIU/mL (Hyperthyroidism) or > 10.0 µIU/mL (Hypothyroidism)',
      hi: '< 0.45 (हाइपरथायरॉइड) या > 10.0 µIU/mL (हाइपोथायरॉइड)',
      mr: '< ०.४५ (हायपरथायरॉइड) किंवा > १०.० µIU/mL (हायपोथायरॉइड)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Master hormone regulating thyroid gland metabolism, energy, weight, and heart rate.',
      hi: 'शरीर के मेटाबॉलिज्म, ऊर्जा, वजन और धड़कन को नियंत्रित करने वाली मुख्य थायरॉइड जांच।',
      mr: 'शरीरातील चयापचय, ऊर्जा, वजन आणि हृदयाचे ठोके नियंत्रित करणारी मुख्य थायरॉइड चाचणी.',
    },
    clinicalTips: {
      en: 'If on thyroid medication (Levothyroxine), take it first thing in the morning on an empty stomach 45 mins before tea/breakfast.',
      hi: 'थायरॉइड की गोली सुबह सबसे पहले खाली पेट लें और उसके 45 मिनट बाद ही चाय या नाश्ता करें।',
      mr: 'थायरॉइडची गोळी सकाळी उठल्यावर उपाशीपोटी घ्या आणि त्यानंतर ४५ मिनिटांनी चहा किंवा नाश्ता करा.',
    },
  },
  {
    id: 'vitamin_d',
    category: 'thyroid_vitamins',
    name: {
      en: 'Vitamin D (25-Hydroxy Vitamin D3)',
      hi: 'विटामिन डी (Vitamin D3 - हड्डियों व इम्युनिटी के लिए)',
      mr: 'व्हिटॅमिन डी (Vitamin D3 - हाडे व प्रतिकारशक्तीसाठी)',
    },
    shortCode: 'Vit-D',
    unit: 'ng/mL',
    normalMin: 30,
    normalMax: 100,
    borderlineLow: 20,
    normalRangeText: {
      en: '30 – 100 ng/mL (Sufficient)',
      hi: '30 – 100 ng/mL (पर्याप्त व सामान्य)',
      mr: '३० – १०० ng/mL (पुरेसे व सामान्य)',
    },
    borderlineRangeText: {
      en: '20 – 29 ng/mL (Insufficient)',
      hi: '20 – 29 ng/mL (हल्की कमी)',
      mr: '२० – २९ ng/mL (सौम्य कमतरता)',
    },
    abnormalRangeText: {
      en: '< 20 ng/mL (Deficient - Bone & Muscle Pain) or > 100 ng/mL (Toxicity)',
      hi: '< 20 ng/mL (गंभीर कमी - हड्डियों व मांसपेशियों में दर्द)',
      mr: '< २० ng/mL (तीव्र कमतरता - हाडे व स्नायू दुखी)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Sunshine vitamin required for calcium absorption, bone density, and immune strength.',
      hi: 'कैल्शियम के अवशोषण, मजबूत हड्डियों और रोग प्रतिरोधक क्षमता के लिए आवश्यक विटामिन।',
      mr: 'कॅल्शियम शोषण्यासाठी, मजबूत हाडांसाठी आणि रोगप्रतिकारक शक्तीसाठी आवश्यक जीवनसत्त्व.',
    },
    clinicalTips: {
      en: 'Get 15–20 minutes of morning sunlight (before 9 AM) daily and consult your doctor for D3 sachet/capsule course if < 30.',
      hi: 'रोज सुबह 15–20 मिनट हल्की धूप लें; कमी होने पर डॉक्टर की सलाह से विटामिन D3 लें।',
      mr: 'दररोज सकाळी १५–२० मिनिटे कोवळे ऊन घ्या; कमतरता असल्यास डॉक्टरांच्या सल्ल्याने D3 घ्या.',
    },
  },
  {
    id: 'vitamin_b12',
    category: 'thyroid_vitamins',
    name: {
      en: 'Vitamin B12 (Cyanocobalamin)',
      hi: 'विटामिन बी12 (Vitamin B12 - नसों व स्मृति के लिए)',
      mr: 'व्हिटॅमिन बी१२ (Vitamin B12 - नसा व स्मरणशक्तीसाठी)',
    },
    shortCode: 'B12',
    unit: 'pg/mL',
    normalMin: 250,
    normalMax: 900,
    borderlineLow: 200,
    normalRangeText: {
      en: '250 – 900 pg/mL (Optimal for Nerve & Brain Health: > 350 pg/mL)',
      hi: '250 – 900 pg/mL (नसों के उत्तम स्वास्थ्य के लिए: > 350 pg/mL)',
      mr: '२५० – ९०० pg/mL (नसांच्या उत्तम आरोग्यासाठी: > ३५० pg/mL)',
    },
    borderlineRangeText: {
      en: '200 – 249 pg/mL (Borderline Low)',
      hi: '200 – 249 pg/mL (बॉर्डरलाइन कमी)',
      mr: '२०० – २४९ pg/mL (सीमारेषेवरील कमतरता)',
    },
    abnormalRangeText: {
      en: '< 200 pg/mL (Deficient - Tingling in Hands/Feet, Fatigue, Memory Fog)',
      hi: '< 200 pg/mL (कमी - हाथ-पैरों में झुनझुनी, थकान और कमजोरी)',
      mr: '< २०० pg/mL (कमतरता - हातापायांना मुंग्या येणे, थकवा व अशक्तपणा)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Essential vitamin for nerve myelin protection, red blood cell formation, and cognitive function.',
      hi: 'नसों की सुरक्षा, लाल रक्त कोशिकाओं के निर्माण और याददाश्त के लिए आवश्यक विटामिन।',
      mr: 'नसांचे संरक्षण, लाल रक्तपेशींची निर्मिती आणि स्मरणशक्तीसाठी आवश्यक जीवनसत्त्व.',
    },
    clinicalTips: {
      en: 'Vegetarians and patients taking Metformin for diabetes should check Vitamin B12 annually.',
      hi: 'शाकाहारी लोगों और डायबिटीज की दवा (Metformin) लेने वालों को साल में एक बार B12 जांच करानी चाहिए।',
      mr: 'शाकाहारी व्यक्ती आणि मधुमेहाची गोळी (Metformin) घेणाऱ्यांनी वर्षातून एकदा B12 नक्की तपासावे.',
    },
  },
  {
    id: 'serum_calcium',
    category: 'thyroid_vitamins',
    name: {
      en: 'Serum Calcium & Iron Studies',
      hi: 'सीरम कैल्शियम (Calcium)',
      mr: 'सीरम कॅल्शियम (Calcium)',
    },
    shortCode: 'CA',
    unit: 'mg/dL',
    normalMin: 8.6,
    normalMax: 10.3,
    borderlineLow: 8.2,
    borderlineHigh: 10.6,
    normalRangeText: {
      en: 'Calcium: 8.6 – 10.3 mg/dL (Serum Iron: 60 – 170 µg/dL)',
      hi: 'कैल्शियम: 8.6 – 10.3 mg/dL (सीरम आयरन: 60 – 170 µg/dL)',
      mr: 'कॅल्शियम: ८.६ – १०.३ mg/dL (सीरम आयर्न: ६० – १७० µg/dL)',
    },
    borderlineRangeText: {
      en: '8.2 – 8.5 mg/dL (Mild Hypocalcemia)',
      hi: '8.2 – 8.5 mg/dL (हल्की कैल्शियम कमी)',
      mr: '८.२ – ८.५ mg/dL (कॅल्शियमची सौम्य कमतरता)',
    },
    abnormalRangeText: {
      en: '< 8.2 mg/dL (Muscle Cramps / Osteopenia) or > 10.6 mg/dL',
      hi: '< 8.2 mg/dL (मांसपेशियों में ऐंठन) या > 10.6 mg/dL',
      mr: '< ८.२ mg/dL (स्नायूंमध्ये पेटके येणे) किंवा > १०.६ mg/dL',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Blood calcium level essential for bone strength, muscle contraction, and normal heart rhythm.',
      hi: 'हड्डियों की मजबूती, मांसपेशियों के संकुचन और हृदय की धड़कन के लिए आवश्यक खनिज।',
      mr: 'हाडांची मजबूती, स्नायूंचे कार्य आणि हृदयाच्या ठोक्यांसाठी आवश्यक खनिज.',
    },
    clinicalTips: {
      en: 'Include ragi (nachni), curd, milk, paneer, sesame seeds (til), and almonds in daily meals.',
      hi: 'रागी (नाचनी), दही, दूध, पनीर, तिल और बादाम को दैनिक आहार में शामिल करें।',
      mr: 'नाचणी, दही, दूध, पनीर, तीळ आणि बदाम दैनंदिन आहारात समाविष्ट करा.',
    },
  },
  {
    id: 'electrolytes_sodium_potassium',
    category: 'thyroid_vitamins',
    name: {
      en: 'Serum Electrolytes (Sodium & Potassium)',
      hi: 'इलेक्ट्रोलाइट्स (सोडियम Na+ और पोटैशियम K+)',
      mr: 'इलेक्ट्रोलाईट्स (सोडियम Na+ आणि पोटॅशियम K+)',
    },
    shortCode: 'Na+',
    unit: 'mEq/L',
    normalMin: 135,
    normalMax: 145,
    borderlineLow: 130,
    borderlineHigh: 148,
    normalRangeText: {
      en: 'Sodium (Na+): 135–145 mEq/L | Potassium (K+): 3.5–5.1 mEq/L',
      hi: 'सोडियम (Na+): 135–145 mEq/L | पोटैशियम (K+): 3.5–5.1 mEq/L',
      mr: 'सोडियम (Na+): १३५–१४५ mEq/L | पोटॅशियम (K+): ३.५–५.१ mEq/L',
    },
    borderlineRangeText: {
      en: 'Sodium 130–134 mEq/L (Mild Hyponatremia - Common in Seniors on BP Diuretics)',
      hi: 'सोडियम 130–134 mEq/L (हल्की सोडियम कमी - बुजुर्गों में आम)',
      mr: 'सोडियम १३०–१३४ mEq/L (सोडियमची सौम्य कमतरता - ज्येष्ठांमध्ये आढळते)',
    },
    abnormalRangeText: {
      en: 'Sodium < 130 mEq/L (Confusion/Weakness) or Potassium > 5.5 mEq/L (Cardiac Alert)',
      hi: 'सोडियम < 130 (चक्कर/भ्रम) या पोटैशियम > 5.5 mEq/L (हृदय जोखिम)',
      mr: 'सोडियम < १३० (गोंधळ/अशक्तपणा) किंवा पोटॅशियम > ५.५ mEq/L (हृदयासाठी धोकादायक)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Vital mineral balance controlling brain alertness, fluid hydration, and heart electrical rhythm.',
      hi: 'मस्तिष्क की सतर्कता, शरीर में पानी के संतुलन और हृदय गति को नियंत्रित करने वाले खनिज।',
      mr: 'मेंदूची सतर्कता, शरीरातील पाण्याचे संतुलन आणि हृदयाची गती नियंत्रित करणारी खनिजे.',
    },
    clinicalTips: {
      en: 'Sudden drowsiness or confusion in elderly patients can be due to low Sodium (Hyponatremia).',
      hi: 'बुजुर्गों में अचानक सुस्ती, कमजोरी या भ्रम होना सोडियम कम होने का लक्षण हो सकता है।',
      mr: 'ज्येष्ठ नागरिकांमध्ये अचानक येणारी गुंगी, अशक्तपणा किंवा गोंधळ हे सोडियम कमी झाल्याचे लक्षण असू शकते.',
    },
  },

  // 6. Vitals, Cardiac & Lung Tests
  {
    id: 'bp_systolic_diastolic',
    category: 'vitals_cardiac',
    name: {
      en: 'Blood Pressure (Systolic / Diastolic BP)',
      hi: 'रक्तचाप (Blood Pressure - बीपी)',
      mr: 'रक्तदाब (Blood Pressure - बीपी)',
    },
    shortCode: 'BP',
    unit: 'mmHg',
    normalMin: 90,
    normalMax: 120,
    borderlineHigh: 139,
    normalRangeText: {
      en: 'Normal: 90/60 to 120/80 mmHg (Seniors 60+ Target: < 130/80 mmHg)',
      hi: 'सामान्य: 90/60 से 120/80 mmHg (वरिष्ठ नागरिकों के लिए: < 130/80 mmHg)',
      mr: 'सामान्य: ९०/६० ते १२०/८० mmHg (ज्येष्ठ नागरिकांसाठी: < १३०/८० mmHg)',
    },
    borderlineRangeText: {
      en: '121–139 / 81–89 mmHg (Elevated / Stage 1 Hypertension)',
      hi: '121–139 / 81–89 mmHg (बॉर्डरलाइन / स्टेज 1 हाई बीपी)',
      mr: '१२१–१३९ / ८१–८९ mmHg (बॉर्डरलाईन / स्टेज १ उच्च रक्तदाब)',
    },
    abnormalRangeText: {
      en: '≥ 140/90 mmHg (High BP) | ≥ 180/120 mmHg (Hypertensive Emergency)',
      hi: '≥ 140/90 mmHg (हाई बीपी) | ≥ 180/120 mmHg (आपातकालीन स्थिति)',
      mr: '≥ १४०/९० mmHg (उच्च रक्तदाब) | ≥ १८०/१२० mmHg (तातडीची वैद्यकीय स्थिती)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Pressure exerted by circulating blood on artery walls during heartbeat (Systolic) and rest (Diastolic).',
      hi: 'धमनियों की दीवारों पर रक्त का दबाव (ऊपरी सिस्टोलिक और निचला डायस्टोलिक)।',
      mr: 'रक्तवाहिन्यांच्या भिंतींवर पडणारा रक्ताचा दाब (वरचा सिस्टोलिक आणि खालचा डायस्टोलिक).',
    },
    clinicalTips: {
      en: 'Sit quietly for 5 minutes before checking BP. Limit salt intake to < 5g (1 teaspoon) per day.',
      hi: 'बीपी मापने से पहले 5 मिनट शांत बैठें। नमक का सेवन दिन में 1 छोटे चम्मच से कम रखें।',
      mr: 'बीपी मोजण्यापूर्वी ५ मिनिटे शांत बसा. मिठाचे प्रमाण दिवसातून १ छोट्या चमच्यापेक्षा कमी ठेवा.',
    },
  },
  {
    id: 'spo2_pulse',
    category: 'vitals_cardiac',
    name: {
      en: 'Pulse Oximetry (SpO2) & Resting Heart Rate',
      hi: 'ऑक्सीजन स्तर (SpO2) और पल्स रेट (नाड़ी गति)',
      mr: 'ऑक्सिजन पातळी (SpO2) आणि नाडीचे ठोके (Pulse)',
    },
    shortCode: 'SpO2',
    unit: '%',
    normalMin: 95,
    normalMax: 100,
    borderlineLow: 92,
    normalRangeText: {
      en: 'SpO2: 95% – 100% | Resting Pulse: 60 – 100 bpm',
      hi: 'SpO2: 95% – 100% | शांत अवस्था में पल्स: 60 – 100 bpm',
      mr: 'SpO2: ९५% – १००% | विश्रांतीच्या वेळी पल्स: ६० – १०० ठोके/मिनिट',
    },
    borderlineRangeText: {
      en: 'SpO2: 92% – 94% (Check deep breathing; consult doctor if persistent)',
      hi: 'SpO2: 92% – 94% (गहरी सांस लें; बना रहे तो डॉक्टर को दिखाएं)',
      mr: 'SpO2: ९२% – ९४% (दीर्घ श्वास घ्या; कायम राहिल्यास डॉक्टरांना दाखवा)',
    },
    abnormalRangeText: {
      en: 'SpO2 < 92% (Hypoxemia - Immediate Medical Attention Required)',
      hi: 'SpO2 < 92% (ऑक्सीजन की कमी - तुरंत अस्पताल जाएं)',
      mr: 'SpO2 < ९२% (ऑक्सिजनची कमतरता - तात्काळ रुग्णालयात जा)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Percentage of oxygen saturation in arterial blood and heart beats per minute.',
      hi: 'रक्त में ऑक्सीजन का प्रतिशत और प्रति मिनट हृदय की धड़कन।',
      mr: 'रक्तातील ऑक्सिजनचे प्रमाण आणि प्रति मिनिट हृदयाचे ठोके.',
    },
    clinicalTips: {
      en: 'Warm fingers and remove dark nail polish before placing the pulse oximeter clip.',
      hi: 'ऑक्सीमीटर लगाने से पहले उंगलियां साफ और सामान्य तापमान पर रखें।',
      mr: 'ऑक्सिमीटर लावण्यापूर्वी बोटे स्वच्छ आणि सामान्य तापमानावर ठेवा.',
    },
  },
  {
    id: 'ecg_echo',
    category: 'vitals_cardiac',
    name: {
      en: '12-Lead ECG, 2D Echo (LVEF %) & hs-CRP',
      hi: 'ईसीजी (ECG), 2D इको (LVEF %) और hs-CRP',
      mr: 'ईसीजी (ECG), 2D इको (LVEF %) आणि hs-CRP',
    },
    shortCode: 'LVEF',
    unit: '%',
    normalMin: 55,
    normalMax: 70,
    borderlineLow: 45,
    normalRangeText: {
      en: '2D Echo LVEF: 55%–70% | ECG: Normal Sinus Rhythm | hs-CRP: < 1.0 mg/L',
      hi: '2D इको LVEF: 55%–70% | ECG: सामान्य साइनस रिदम | hs-CRP: < 1.0 mg/L',
      mr: '2D इको LVEF: ५५%–७०% | ECG: नॉर्मल सायनस रिदम | hs-CRP: < १.० mg/L',
    },
    borderlineRangeText: {
      en: 'LVEF: 45%–54% (Mildly Reduced Pumping) | hs-CRP: 1.0–3.0 mg/L',
      hi: 'LVEF: 45%–54% (हृदय पंपिंग में हल्की कमी) | hs-CRP: 1.0–3.0 mg/L',
      mr: 'LVEF: ४५%–५४% (हृदय पंपिंगमध्ये सौम्य घट) | hs-CRP: १.०–३.० mg/L',
    },
    abnormalRangeText: {
      en: 'LVEF < 45% or ST-T changes on ECG or Troponin-I Positive',
      hi: 'LVEF < 45% या ECG में बदलाव या ट्रोपोनिन पॉजिटिव',
      mr: 'LVEF < ४५% किंवा ECG मध्ये बदल किंवा ट्रोपोनिन पॉझिटिव्ह',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Electrical rhythm of heart (ECG), heart muscle pumping efficiency (LVEF), and vascular inflammation (hs-CRP).',
      hi: 'हृदय की विद्युत गति (ECG), हृदय की पंपिंग क्षमता (LVEF) और धमनियों की सूजन (hs-CRP)।',
      mr: 'हृदयाची विद्युत गती (ECG), हृदयाची पंपिंग क्षमता (LVEF) आणि रक्तवाहिन्यांची सूज (hs-CRP).',
    },
    clinicalTips: {
      en: 'Never ignore chest heaviness, left arm/jaw pain, or sudden breathlessness—get an ECG immediately.',
      hi: 'सीने में भारीपन, बाएं हाथ/जबड़े में दर्द या सांस फूलने को कभी नजरअंदाज न करें—तुरंत ECG कराएं।',
      mr: 'छातीत जडपणा, डाव्या हातात/जबड्यात वेदना किंवा धाप लागण्याकडे दुर्लक्ष करू नका—तात्काळ ECG करा.',
    },
  },
  {
    id: 'spirometry_pft',
    category: 'vitals_cardiac',
    name: {
      en: 'Pulmonary Function Test (PFT / FEV1/FVC) & Peak Flow',
      hi: 'फेफड़ों की कार्य क्षमता जांच (PFT / Spirometry)',
      mr: 'फुफ्फुसांची कार्यक्षमता चाचणी (PFT / Spirometry)',
    },
    shortCode: 'FEV1',
    unit: '%',
    normalMin: 80,
    normalMax: 120,
    borderlineLow: 70,
    normalRangeText: {
      en: 'FEV1 & FVC: ≥ 80% of predicted | FEV1/FVC Ratio: > 0.70 (70%)',
      hi: 'FEV1 व FVC: ≥ 80% | FEV1/FVC अनुपात: > 0.70 (70%)',
      mr: 'FEV1 व FVC: ≥ ८०% | FEV1/FVC गुणोत्तर: > ०.७० (७०%)',
    },
    borderlineRangeText: {
      en: '70% – 79% of predicted (Mild Airway Obstruction)',
      hi: '70% – 79% (सांस की नली में हल्की रुकावट)',
      mr: '७०% – ७९% (श्वसनमार्गात सौम्य अडथळा)',
    },
    abnormalRangeText: {
      en: '< 70% (Asthma or COPD Airway Obstruction)',
      hi: '< 70% (अस्थमा या COPD का संकेत)',
      mr: '< ७०% (दमा किंवा COPD चा संकेत)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Lung capacity and airway openness; detects asthma, bronchitis, and COPD.',
      hi: 'फेफड़ों की हवा भरने और बाहर निकालने की क्षमता; अस्थमा व ब्रोंकाइटिस की पहचान।',
      mr: 'फुफ्फुसांची हवा घेण्याची व सोडण्याची क्षमता; दमा व ब्रॉन्कायटिसची ओळख.',
    },
    clinicalTips: {
      en: 'Practice Anulom-Vilom and diaphragmatic breathing daily; avoid smoke and dust exposure.',
      hi: 'नियमित अनुलोम-विलोम प्राणायाम करें और धुएं व धूल से बचाव करें।',
      mr: 'नियमित अनुलोम-विलोम प्राणायाम करा आणि धूर व धुळीपासून संरक्षण करा.',
    },
  },

  // 7. Urine, Bone, Eye & Screening Tests
  {
    id: 'urine_routine',
    category: 'urine_other',
    name: {
      en: 'Urine Routine & Microscopy (Urine R/M)',
      hi: 'यूरिन रूटीन और माइक्रोस्कोपी (पेशाब की जांच)',
      mr: 'युरिन रुटीन आणि मायक्रोस्कोपी (लघवीची चाचणी)',
    },
    shortCode: 'pH',
    unit: 'pH',
    normalMin: 4.5,
    normalMax: 7.5,
    borderlineLow: 4.0,
    borderlineHigh: 8.0,
    normalRangeText: {
      en: 'pH: 4.5–7.5 | Sugar & Protein: Absent (Nil) | Pus Cells: 0–5 /hpf | RBC: Nil',
      hi: 'pH: 4.5–7.5 | शुगर व प्रोटीन: Nil (अनुपस्थित) | पस सेल्स: 0–5 /hpf',
      mr: 'pH: ४.५–७.५ | शुगर व प्रथिने: Nil (नसणे) | पस सेल्स: ०–५ /hpf',
    },
    borderlineRangeText: {
      en: 'Trace Protein or Pus Cells 6–10 /hpf (Mild Urinary Irritation)',
      hi: 'ट्रेस प्रोटीन या पस सेल्स 6–10 /hpf (हल्का यूरिन संक्रमण)',
      mr: 'ट्रेस प्रोटीन किंवा पस सेल्स ६–१० /hpf (सौम्य लघवी संसर्ग)',
    },
    abnormalRangeText: {
      en: 'Sugar/Ketones Present, Protein 1+/2+, or Pus Cells > 10 /hpf (UTI / Kidney Alert)',
      hi: 'शुगर/प्रोटीन आना या पस सेल्स > 10 /hpf (UTI / किडनी संक्रमण)',
      mr: 'शुगर/प्रथिने आढळणे किंवा पस सेल्स > १० /hpf (UTI / किडनी संसर्ग)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Detects urinary tract infections (UTI), diabetic kidney protein leakage, and kidney stones.',
      hi: 'पेशाब के संक्रमण (UTI), किडनी से प्रोटीन रिसाव और पथरी की पहचान करता है।',
      mr: 'लघवीचा जंतूसंसर्ग (UTI), किडनीतून प्रथिनांची गळती आणि मूतखडा ओळखते.',
    },
    clinicalTips: {
      en: 'Collect a clean mid-stream morning urine sample for the most accurate laboratory result.',
      hi: 'सटीक रिपोर्ट के लिए सुबह के पेशाब की मध्य धारा (Mid-stream) का नमूना साफ डिब्बी में दें।',
      mr: 'अचूक अहवालासाठी सकाळच्या लघवीच्या मधल्या धारेचा (Mid-stream) नमुना स्वच्छ डबीत द्या.',
    },
  },
  {
    id: 'dexa_bone_density',
    category: 'urine_other',
    name: {
      en: 'DEXA Bone Mineral Density (T-Score)',
      hi: 'डेक्सा बोन डेंसिटी टेस्ट (DEXA T-Score - हड्डियों की मजबूती)',
      mr: 'डेक्सा बोन डेन्सिटी टेस्ट (DEXA T-Score - हाडांची घनता)',
    },
    shortCode: 'DEXA',
    unit: 'T-Score',
    normalMin: -1.0,
    normalMax: 2.5,
    borderlineLow: -2.4,
    normalRangeText: {
      en: 'T-Score: -1.0 or higher (Normal Bone Density)',
      hi: 'T-Score: -1.0 या उससे अधिक (सामान्य मजबूत हड्डियां)',
      mr: 'T-Score: -१.० किंवा त्याहून अधिक (सामान्य मजबूत हाडे)',
    },
    borderlineRangeText: {
      en: 'T-Score: -1.1 to -2.4 (Osteopenia - Mild Bone Thinning)',
      hi: 'T-Score: -1.1 से -2.4 (ऑस्टियोपीनिया - हड्डियों में हल्की कमजोरी)',
      mr: 'T-Score: -१.१ ते -२.४ (ऑस्टियोपेनिया - हाडांची सौम्य झीज)',
    },
    abnormalRangeText: {
      en: 'T-Score: ≤ -2.5 (Osteoporosis - High Fracture Risk)',
      hi: 'T-Score: ≤ -2.5 (ऑस्टियोपोरोसिस - फ्रैक्चर का जोखिम)',
      mr: 'T-Score: ≤ -२.५ (ऑस्टियोपोरोसिस - हाडे ठिसूळ होण्याचा धोका)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Measures calcium mineral density in spine and hip bones to assess fracture risk.',
      hi: 'रीढ़ और कूल्हे की हड्डियों में कैल्शियम घनता मापकर फ्रैक्चर के खतरे का पता लगाता है।',
      mr: 'पाठीचा कणा आणि खुब्याच्या हाडांमधील कॅल्शियमची घनता मोजून फ्रॅक्चरचा धोका ओळखते.',
    },
    clinicalTips: {
      en: 'Recommended for women over 50 and men over 60 to prevent age-related falls and fractures.',
      hi: '50+ महिलाओं और 60+ पुरुषों के लिए हड्डियों की सुरक्षा हेतु यह जांच बहुत उपयोगी है।',
      mr: '५०+ महिला आणि ६०+ पुरुषांसाठी हाडांच्या सुरक्षिततेसाठी ही चाचणी अत्यंत उपयुक्त आहे.',
    },
  },
  {
    id: 'eye_iop',
    category: 'urine_other',
    name: {
      en: 'Eye Checkup: Intraocular Pressure (IOP / Glaucoma) & Vision',
      hi: 'नेत्र जांच: आंखों का दबाव (IOP / काला मोतिया) व दृष्टि',
      mr: 'नेत्र तपासणी: डोळ्यांचा दाब (IOP / काचबिंदू) व दृष्टी',
    },
    shortCode: 'IOP',
    unit: 'mmHg',
    normalMin: 10,
    normalMax: 21,
    borderlineHigh: 24,
    normalRangeText: {
      en: 'Eye Pressure (IOP): 10 – 21 mmHg | Visual Acuity: 6/6 (or 20/20)',
      hi: 'आंखों का दबाव (IOP): 10 – 21 mmHg | दृष्टि: 6/6',
      mr: 'डोळ्यांचा दाब (IOP): १० – २१ mmHg | दृष्टी: ६/६',
    },
    borderlineRangeText: {
      en: '22 – 24 mmHg (Ocular Hypertension - Monitor for Glaucoma)',
      hi: '22 – 24 mmHg (बॉर्डरलाइन दबाव - काला मोतिया की निगरानी)',
      mr: '२२ – २४ mmHg (सीमारेषेवरील दाब - काचबिंदूसाठी लक्ष ठेवा)',
    },
    abnormalRangeText: {
      en: '> 24 mmHg (Glaucoma Optic Nerve Risk)',
      hi: '> 24 mmHg (काला मोतियाबिंद / ग्लूकोमा का जोखिम)',
      mr: '> २४ mmHg (काचबिंदू / ग्लुकोमाचा धोका)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Fluid pressure inside the eye (Tonometry), cataract screening, and diabetic retina checkup.',
      hi: 'आंखों के अंदर का दबाव (काला मोतिया जांच), सफेद मोतियाबिंद और डायबिटिक रेटिना जांच।',
      mr: 'डोळ्यांच्या आतील दाब (काचबिंदू तपासणी), मोतीबिंदू आणि डायबिटिक रेटिना तपासणी.',
    },
    clinicalTips: {
      en: 'Seniors and diabetics should undergo an annual dilated retina exam and cataract/glaucoma check.',
      hi: 'वरिष्ठ नागरिकों और मधुमेह रोगियों को साल में एक बार रेटिना और मोतियाबिंद की जांच करानी चाहिए।',
      mr: 'ज्येष्ठ नागरिक आणि मधुमेहींनी वर्षातून एकदा रेटिना आणि मोतीबिंदूची तपासणी करावी.',
    },
  },
  {
    id: 'psa_cancer_screening',
    category: 'urine_other',
    name: {
      en: 'PSA (Prostate Specific Antigen) & Preventive Screenings',
      hi: 'पीएसए (PSA - प्रोस्टेट जांच) व कैंसर स्क्रीनिंग',
      mr: 'पीएसए (PSA - प्रोस्टेट चाचणी) व कर्करोग तपासणी',
    },
    shortCode: 'PSA',
    unit: 'ng/mL',
    normalMin: 0.0,
    normalMax: 4.0,
    borderlineHigh: 10.0,
    normalRangeText: {
      en: 'Total PSA (Men): 0.0 – 4.0 ng/mL | Women: Pap Smear & Mammogram Negative (BI-RADS 1/2)',
      hi: 'कुल PSA (पुरुष): 0.0 – 4.0 ng/mL | महिला: पैप स्मीयर व मैमोग्राफी सामान्य',
      mr: 'एकूण PSA (पुरुष): ०.० – ४.० ng/mL | महिला: पॅप स्मिअर व मॅमोग्राफी सामान्य',
    },
    borderlineRangeText: {
      en: 'PSA: 4.1 – 10.0 ng/mL (Often Benign Prostate Enlargement / BPH in Seniors)',
      hi: 'PSA: 4.1 – 10.0 ng/mL (प्रोस्टेट ग्रंथि का बढ़ना - डॉक्टर से परामर्श लें)',
      mr: 'PSA: ४.१ – १०.० ng/mL (प्रोस्टेट ग्रंथीची वाढ - डॉक्टरांचा सल्ला घ्या)',
    },
    abnormalRangeText: {
      en: 'PSA > 10.0 ng/mL (Urologist Evaluation Required)',
      hi: 'PSA > 10.0 ng/mL (यूरोलॉजिस्ट से जांच आवश्यक)',
      mr: 'PSA > १०.० ng/mL (युरोलॉजिस्टकडून तपासणी आवश्यक)',
    },
    fastingRequired: false,
    whatItMeasures: {
      en: 'Prostate gland health marker for men over 50; paired with Mammogram/Pap smear guidance for women.',
      hi: '50+ पुरुषों में प्रोस्टेट ग्रंथि के स्वास्थ्य की जांच और महिलाओं के लिए निवारक जांच।',
      mr: '५०+ पुरुषांमध्ये प्रोस्टेट ग्रंथीच्या आरोग्याची चाचणी आणि महिलांसाठी प्रतिबंधात्मक तपासण्या.',
    },
    clinicalTips: {
      en: 'Men over 50 experiencing frequent night urination or weak stream should get a PSA blood test and Ultrasound.',
      hi: '50 से अधिक उम्र के पुरुषों को रात में बार-बार पेशाब आने पर PSA और सोनोग्राफी जांच करानी चाहिए।',
      mr: '५० पेक्षा जास्त वयाच्या पुरुषांना रात्री वारंवार लघवीला होत असल्यास PSA आणि सोनोग्राफी करावी.',
    },
  },
];
