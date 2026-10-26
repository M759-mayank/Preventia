export type Language = 'en' | 'hi' | 'mr';

export interface DiseaseInfo {
  id: string;
  name: Record<Language, string>;
  category: Record<Language, string>;
  overview: Record<Language, string>;
  symptoms: Record<Language, string[]>;
  prevention: Record<Language, string[]>;
  dietByAge: {
    children: Record<Language, string>;
    adults: Record<Language, string>;
    seniors: Record<Language, string>;
  };
}

export interface AgeScreeningRecommendation {
  ageGroupId: string;
  ageRange: string;
  label: Record<Language, string>;
  screenings: Record<Language, { test: string; frequency: string; reason: string }[]>;
  dietaryFocus: Record<Language, string[]>;
  sleepTarget: Record<Language, string>;
}

export interface ExerciseInfo {
  id: string;
  name: Record<Language, string>;
  category: Record<Language, string>;
  duration: Record<Language, string>;
  intensity: Record<Language, string>;
  overview: Record<Language, string>;
  steps: Record<Language, string[]>;
  benefits: Record<Language, string[]>;
  precautions: Record<Language, string[]>;
  ageRecommendations: {
    children: Record<Language, string>;
    adults: Record<Language, string>;
    seniors: Record<Language, string>;
  };
}

export interface AgeExercisePlan {
  ageGroupId: string;
  ageRange: string;
  label: Record<Language, string>;
  dailyTarget: Record<Language, string>;
  weeklySchedule: Record<Language, { activity: string; duration: string; focus: string }[]>;
  safetyTips: Record<Language, string[]>;
}

export const EXERCISES_LIBRARY: ExerciseInfo[] = [
  {
    id: 'brisk_walking_shatpavali',
    name: {
      en: 'Brisk Walking & Post-Meal Shatpavali',
      hi: 'तेज पैदल चलना और भोजन के बाद शतपावली',
      mr: 'भरभर चालणे आणि जेवणानंतरची शतपावली',
    },
    category: {
      en: 'Cardiovascular & Metabolic Exercise',
      hi: 'हृदय और शुगर नियंत्रण व्यायाम',
      mr: 'हृदय आणि मधुमेह नियंत्रण व्यायाम',
    },
    duration: {
      en: '30 mins morning + 15 mins after meals',
      hi: 'सुबह 30 मिनट + भोजन के बाद 15 मिनट',
      mr: 'सकाळी ३० मिनिटे + जेवणानंतर १५ मिनिटे',
    },
    intensity: {
      en: 'Low to Moderate Impact',
      hi: 'हल्का से मध्यम व्यायाम',
      mr: 'सौम्य ते मध्यम तीव्रता',
    },
    overview: {
      en: 'Regular brisk walking combined with the traditional Indian practice of Shatpavali (100 gentle steps after meals) improves insulin sensitivity, lowers blood pressure, and aids digestion.',
      hi: 'नियमित तेज कदमों से चलना और भोजन के बाद 100 कदम टहलना (शतपावली) ब्लड शुगर, उच्च रक्तचाप और पाचन के लिए सबसे सुरक्षित और प्रभावी व्यायाम है।',
      mr: 'नियमित भरभर चालणे आणि जेवणानंतर १०० पावले संथ चालणे (शतपावली) रक्तातील साखर, रक्तदाब आणि पचन सुधारण्यासाठी अत्यंत प्रभावी व्यायाम आहे.',
    },
    steps: {
      en: [
        'Wear comfortable, cushioned footwear with good arch support on a flat walking track.',
        'Start with 5 minutes of slow warm-up walking and gentle shoulder rolls.',
        'Walk at a steady brisk pace where you can speak comfortably without gasping for breath.',
        'After lunch and dinner, take a calm 10–15 minute slow stroll (Shatpavali) indoors or in the courtyard.',
      ],
      hi: [
        'समतल रास्ते पर आरामदायक और ग्रिप वाले जूते पहनकर चलना शुरू करें।',
        'शुरुआत के 5 मिनट सामान्य गति से चलें और कंधों को हल्का घुमाएं।',
        'इसके बाद 20–25 मिनट मध्यम तेज गति से चलें जिसमें सांस न फूले।',
        'दोपहर और रात के खाने के बाद 10–15 मिनट घर के आंगन या बरामदे में धीरे-धीरे टहलें।',
      ],
      mr: [
        'सपाट रस्त्यावर किंवा बागेत मऊ व आरामदायक पादत्राणे घालून चालण्यास सुरुवात करा.',
        'पहिले ५ मिनिटे सावकाश चालून शरीर मोकळे (वॉर्म-अप) करा.',
        'त्यानंतर २० ते २५ मिनिटे मध्यम जलद गतीने चाला, ज्यात दम लागणार नाही.',
        'दुपारच्या आणि रात्रीच्या जेवणानंतर १०–१५ मिनिटे घरात किंवा अंगणात शांतपणे शतपावली करा.',
      ],
    },
    benefits: {
      en: [
        'Reduces post-meal blood glucose spikes by 20–30%',
        'Strengthens heart muscle and lowers bad LDL cholesterol',
        'Lubricates knee and hip joints without high impact',
        'Improves night sleep quality and reduces evening acidity',
      ],
      hi: [
        'भोजन के बाद बढ़ने वाली ब्लड शुगर को 20–30% तक नियंत्रित करता है',
        'हृदय को मजबूत बनाता है और कोलेस्ट्रॉल कम करता है',
        'घुटनों और कूल्हों के जोड़ों में लचीलापन बनाए रखता है',
        'रात में गहरी नींद लाने और एसिडिटी कम करने में सहायक',
      ],
      mr: [
        'जेवणानंतर वाढणारी रक्तातील साखर २०–३०% पर्यंत नियंत्रित ठेवते',
        'हृदयाचे स्नायू मजबूत करते आणि खराब कोलेस्ट्रॉल कमी करते',
        'गुडघे आणि कंबरेच्या सांध्यांची लवचिकता टिकवून ठेवते',
        'रात्री शांत झोप लागण्यास आणि पित्त कमी करण्यास मदत करते',
      ],
    },
    precautions: {
      en: [
        'Carry water and a small sweet/glucose tablet if you take diabetes medication.',
        'Stop immediately if you feel dizziness, chest tightness, or unusual breathlessness.',
      ],
      hi: [
        'मधुमेह के रोगी चलते समय पानी और ग्लूकोज या टॉफी साथ रखें।',
        'चक्कर आने, सीने में भारीपन या तेज सांस फूलने पर तुरंत रुकें और बैठ जाएं।',
      ],
      mr: [
        'मधुमेहाच्या रुग्णांनी चालायला जाताना पाण्याची बाटली व थोडी साखर/गोळी सोबत ठेवावी.',
        'चक्कर आल्यास, छातीत जडपणा किंवा धाप लागल्यास तात्काळ थांबा आणि विश्रांती घ्या.',
      ],
    },
    ageRecommendations: {
      children: {
        en: 'Combine walking with active jogging, cycling, and outdoor team games for 60 mins daily.',
        hi: 'बच्चों के लिए पैदल चलने के साथ साइकिल चलाना, दौड़ना और मैदानी खेल (60 मिनट)।',
        mr: 'लहान मुलांसाठी चालण्यासोबत सायकलिंग, धावणे आणि मैदानी खेळ (दररोज ६० मिनिटे).',
      },
      adults: {
        en: '40 minutes brisk walk (5 km/hr pace) + 15 minutes post-dinner Shatpavali daily.',
        hi: 'प्रतिदिन 40 मिनट तेज वॉक + रात के खाने के बाद 15 मिनट शतपावली।',
        mr: 'दररोज ४० मिनिटे भरभर चालणे + रात्रीच्या जेवणानंतर १५ मिनिटे शतपावली.',
      },
      seniors: {
        en: '20 minutes morning walk + 15 minutes evening walk on level ground; use a walking stick if needed for balance.',
        hi: 'सुबह 20 मिनट और शाम 15 मिनट समतल जमीन पर टहलें; संतुलन के लिए छड़ी का सहारा लेने में संकोच न करें।',
        mr: 'सकाळी २० मिनिटे व संध्याकाळी १५ मिनिटे सपाट जागेवर चाला; तोल सांभाळण्यासाठी गरज असल्यास काठीचा आधार घ्या.',
      },
    },
  },
  {
    id: 'chair_yoga_senior_mobility',
    name: {
      en: 'Chair Yoga & Joint Mobility (Senior Safe)',
      hi: 'चेयर योग (कुर्सी पर योग) और जोड़ों का व्यायाम',
      mr: 'खुर्चीवरील योगासने (Chair Yoga) आणि सांध्यांचे व्यायाम',
    },
    category: {
      en: 'Joint Flexibility & Fall Prevention',
      hi: 'जोड़ों का लचीलापन और संतुलन',
      mr: 'सांध्यांची लवचिकता आणि तोल नियंत्रण',
    },
    duration: {
      en: '20 minutes daily',
      hi: 'प्रतिदिन 20 मिनट',
      mr: 'दररोज २० मिनिटे',
    },
    intensity: {
      en: 'Gentle / Zero-Fall-Risk',
      hi: 'अत्यंत सौम्य (वरिष्ठ नागरिकों के लिए सुरक्षित)',
      mr: 'अतिशय सौम्य (ज्येष्ठ नागरिकांसाठी पूर्णपणे सुरक्षित)',
    },
    overview: {
      en: 'Specially designed seated exercises on a sturdy chair for senior citizens and patients with knee arthritis or balance concerns.',
      hi: 'घुटनों के दर्द, गठिया या कमजोरी वाले बुजुर्गों के लिए मजबूत कुर्सी पर बैठकर किए जाने वाले सुरक्षित सूक्ष्म व्यायाम।',
      mr: 'गुडघेदुखी, संधिवात किंवा अशक्तपणा असलेल्या ज्येष्ठ नागरिकांसाठी मजबूत खुर्चीवर बसून करण्याचे सुरक्षित व्यायाम.',
    },
    steps: {
      en: [
        'Sit upright on a sturdy, non-wheeled chair with feet flat on the floor.',
        'Seated Knee Extensions: Slowly straighten one leg parallel to the floor, hold for 5 seconds, and lower gently (10 reps each leg).',
        'Ankle Circles & Toe Lifts: Rotate both ankles clockwise and anti-clockwise 10 times to improve lower-leg blood circulation.',
        'Seated Overhead Reach & Gentle Twist: Inhale while raising arms gently, exhale while turning torso slightly left and right.',
      ],
      hi: [
        'बिना पहिए वाली मजबूत कुर्सी पर रीढ़ सीधी करके बैठें और पैर जमीन पर टिकाएं।',
        'घुटना स्ट्रेच: एक पैर को धीरे से सीधा ऊपर उठाएं, 5 सेकंड रोकें और धीरे नीचे लाएं (दोनों पैरों से 10 बार)।',
        'टखने घुमाना (Ankle Rotation): पंजों को गोल-गोल 10 बार घुमाएं, इससे पैरों में रक्त संचार बढ़ता है और सूजन कम होती है।',
        'कंधे और कमर स्ट्रेच: सांस लेते हुए दोनों हाथ ऊपर उठाएं और सांस छोड़ते हुए कमर को हल्का दाएं-बाएं मोड़ें।',
      ],
      mr: [
        'चाके नसलेल्या मजबूत खुर्चीवर पाठ ताठ ठेवून बसा आणि पावले जमिनीवर टेकवा.',
        'गुडघ्याचा व्यायाम: एक पाय सावकाश सरळ समोर उचला, ५ सेकंद धरून ठेवा आणि खाली घ्या (प्रत्येकी १० वेळा).',
        'घोटा फिरवणे (Ankle Circles): दोन्ही पावले घड्याळाच्या दिशेने व विरुद्ध दिशेने १० वेळा फिरवा, ज्यामुळे पायातील रक्ताभिसरण सुधारते.',
        'खांदे आणि कंबर स्ट्रेच: दीर्घ श्वास घेत दोन्ही हात वर करा आणि श्वास सोडताना कंबर हलकी डावीकडे व उजवीकडे वळवा.',
      ],
    },
    benefits: {
      en: [
        'Strengthens quadriceps muscles supporting arthritic knees',
        'Prevents ankle swelling and calf cramps in elderly patients',
        'Zero risk of falling while maintaining daily physical movement',
        'Relieves neck, shoulder, and upper back stiffness',
      ],
      hi: [
        'घुटनों को सहारा देने वाली मांसपेशियों को मजबूत करता है',
        'पैरों की सूजन और पिंडलियों की ऐंठन (क्रैम्प्स) को रोकता है',
        'गिरने के जोखिम के बिना पूरे शरीर को सक्रिय रखता है',
        'गर्दन, कंधों और पीठ की जकड़न दूर करता है',
      ],
      mr: [
        'गुडघ्यांना आधार देणाऱ्या मांडीच्या स्नायूंना बळकटी देतो',
        'पायांची सूज आणि पोटऱ्यांमध्ये गोळे येणे (Cramps) थांबवतो',
        'पडण्याची भीती न राहता संपूर्ण शरीराची सुरक्षित हालचाल होते',
        'मान, खांदे आणि पाठीचा ताठरपणा कमी करतो',
      ],
    },
    precautions: {
      en: [
        'Ensure the chair is placed against a wall or non-slip mat.',
        'Never force a joint beyond a comfortable, pain-free range of motion.',
      ],
      hi: [
        'कुर्सी को दीवार के सहारे या फिसलन रहित मैट पर रखें।',
        'किसी भी जोड़ को दर्द की सीमा से अधिक न मोड़ें।',
      ],
      mr: [
        'खुर्ची भिंतीला टेकवून किंवा न घसरणाऱ्या मॅटवर ठेवावी.',
        'कोणताही सांधा दुखत असल्यास जबरदस्तीने वाकवू नका.',
      ],
    },
    ageRecommendations: {
      children: {
        en: 'Useful as study-break posture stretches every 45 minutes of desk study.',
        hi: 'पढ़ाई के दौरान हर 45 मिनट में गर्दन और पीठ को सीधा रखने के लिए उपयोगी।',
        mr: 'अभ्यास करताना दर ४५ मिनिटांनी पाठ व मान सरळ करण्यासाठी उपयुक्त स्ट्रेचिंग.',
      },
      adults: {
        en: 'Ideal 10-minute office desk mobility routine to prevent cervical spondylosis and lower back pain.',
        hi: 'ऑफिस में कंप्यूटर पर काम करने वालों के लिए गर्दन और कमर दर्द से बचाव हेतु 10 मिनट का अभ्यास।',
        mr: 'ऑफिसमध्ये संगणकावर काम करणाऱ्यांसाठी मान व कंबरदुखी टाळण्यासाठी १० मिनिटांचा उत्तम व्यायाम.',
      },
      seniors: {
        en: 'Primary daily morning and evening routine (15–20 mins) for seniors 60+ and 75+ years.',
        hi: '60+ और 75+ वर्ष के बुजुर्गों के लिए सुबह-शाम 15–20 मिनट का मुख्य सुरक्षित व्यायाम।',
        mr: '६०+ आणि ७५+ वयाच्या ज्येष्ठ नागरिकांसाठी सकाळी व संध्याकाळी १५–२० मिनिटांचा सर्वोत्तम सुरक्षित व्यायाम.',
      },
    },
  },
  {
    id: 'pranayama_breathing',
    name: {
      en: 'Pranayama & Deep Diaphragmatic Breathing',
      hi: 'प्राणायाम (अनुलोम-विलोम और भ्रामरी) एवं श्वसन व्यायाम',
      mr: 'प्राणायाम (अनुलोम-विलोम व भ्रामरी) आणि दीर्घ श्वसन',
    },
    category: {
      en: 'Respiratory Capacity & Blood Pressure Calmness',
      hi: 'फेफड़ों की क्षमता और मानसिक शांति',
      mr: 'फुफ्फुसांची क्षमता आणि मानसिक शांतता',
    },
    duration: {
      en: '15 minutes morning & evening',
      hi: 'सुबह और शाम 15 मिनट',
      mr: 'सकाळी आणि संध्याकाळी १५ मिनिटे',
    },
    intensity: {
      en: 'Restorative & Calming',
      hi: 'शांत और तनाव-मुक्त',
      mr: 'शांत आणि तणावमुक्त करणारे',
    },
    overview: {
      en: 'Controlled yogic breathing expands lung capacity, improves blood oxygen saturation (SpO2), calms the vagus nerve, and naturally reduces high blood pressure and anxiety.',
      hi: 'नियंत्रित श्वसन अभ्यास फेफड़ों की क्षमता बढ़ाता है, ऑक्सीजन स्तर (SpO2) सुधारता है और उच्च रक्तचाप व मानसिक तनाव को प्राकृतिक रूप से कम करता है।',
      mr: 'नियंत्रित श्वसनाचा सराव फुफ्फुसांची कार्यक्षमता वाढवतो, रक्तातील ऑक्सिजन (SpO2) सुधारतो आणि उच्च रक्तदाब व ताण नैसर्गिकरीत्या कमी करतो.',
    },
    steps: {
      en: [
        'Sit comfortably on a mat or chair in a well-ventilated room on an empty stomach.',
        'Anulom-Vilom (Alternate Nostril): Inhale gently through the left nostril for 4 seconds, exhale smoothly through the right nostril for 6 seconds, then alternate.',
        'Bhramari (Humming Bee Breath): Inhale deeply and exhale making a soft humming sound for 5 rounds to calm headache and hypertension.',
        'Belly Breathing: Place one hand on the abdomen and take 10 slow deep breaths.',
      ],
      hi: [
        'हवादार कमरे में चटाई या कुर्सी पर खाली पेट आराम से सीधे बैठें।',
        'अनुलोम-विलोम: बाईं नासिका से 4 सेकंड तक धीमी सांस लें और दाईं नासिका से 6 सेकंड में छोड़ें, फिर क्रम बदलें।',
        'भ्रामरी प्राणायाम: गहरी सांस लेकर भंवरे जैसी मधुर गुंजन करते हुए सांस छोड़ें (5 से 7 बार)।',
        'अंत में 2 मिनट शांत बैठकर सामान्य सांसों पर ध्यान केंद्रित करें।',
      ],
      mr: [
        'मोकळ्या हवेच्या खोलीत सतरंजीवर किंवा खुर्चीवर रिकाम्या पोटी ताठ बसा.',
        'अनुलोम-विलोम: डाव्या नाकपुडीने ४ सेकंद संथ श्वास घ्या आणि उजव्या नाकपुडीने ६ सेकंदात सोडा; त्यानंतर क्रम बदला.',
        'भ्रामरी प्राणायाम: दीर्घ श्वास घेऊन भुंग्यासारखा गुंजारव करत श्वास सोडा (५ ते ७ आवर्तने).',
        'शेवटी २ मिनिटे डोळे मिटून शांत श्वसनावर लक्ष केंद्रित करा.',
      ],
    },
    benefits: {
      en: [
        'Lowers systolic blood pressure and resting heart rate naturally',
        'Clears airways and strengthens respiratory muscles against seasonal infections',
        'Improves focus, memory, and deep restorative sleep at night',
      ],
      hi: [
        'हाई ब्लड प्रेशर और हृदय की तेज धड़कन को शांत करता है',
        'श्वसन तंत्र को मजबूत कर मौसमी संक्रमण से बचाता है',
        'एकाग्रता बढ़ाता है और अनिद्रा (नींद न आना) की समस्या दूर करता है',
      ],
      mr: [
        'उच्च रक्तदाब आणि हृदयाची धडधड नैसर्गिकरीत्या नियंत्रित करते',
        'श्वसन संस्था मजबूत करून हंगामी संसर्गांपासून रक्षण करते',
        'स्मरणशक्ती वाढवते आणि रात्री शांत झोप लागण्यास मदत करते',
      ],
    },
    precautions: {
      en: [
        'Avoid holding breath forcefully (Kumbhaka) if you have high BP or heart disease.',
        'Avoid fast Kapalbhati if you have hypertension, hernia, or recent surgery.',
      ],
      hi: [
        'हाई बीपी और हृदय रोगी सांस को जबरदस्ती न रोकें (कुंभक न करें)।',
        'उच्च रक्तचाप या हर्निया होने पर तेज कपालभाति करने से बचें।',
      ],
      mr: [
        'उच्च रक्तदाब किंवा हृदयरोग असल्यास श्वास रोखून धरू नका (कुंभक टाळा).',
        'रक्तदाब, हर्निया किंवा शस्त्रक्रिया झाली असल्यास जलद कपालभाती करू नका.',
      ],
    },
    ageRecommendations: {
      children: {
        en: '5 minutes of Bhramari and deep breathing before school/study to boost concentration.',
        hi: 'पढ़ाई से पहले 5 मिनट भ्रामरी और गहरी सांस का अभ्यास एकाग्रता बढ़ाता है।',
        mr: 'अभ्यासापूर्वी ५ मिनिटे भ्रामरी आणि दीर्घ श्वसन केल्याने एकाग्रता वाढते.',
      },
      adults: {
        en: '15 minutes daily to counter work stress, cortisol spikes, and tension headaches.',
        hi: 'कार्यस्थल के तनाव और सिरदर्द से मुक्ति के लिए रोज 15 मिनट प्राणायाम।',
        mr: 'कामाचा ताण आणि डोकेदुखी कमी करण्यासाठी दररोज १५ मिनिटे प्राणायाम.',
      },
      seniors: {
        en: '15 minutes slow Anulom-Vilom and Bhramari morning and evening (seated comfortably on a chair).',
        hi: 'बुजुर्गों के लिए कुर्सी पर बैठकर सुबह-शाम 15 मिनट धीमा अनुलोम-विलोम और भ्रामरी।',
        mr: 'ज्येष्ठ नागरिकांसाठी खुर्चीवर बसून सकाळी व संध्याकाळी १५ मिनिटे संथ अनुलोम-विलोम व भ्रामरी.',
      },
    },
  },
  {
    id: 'strength_balance_training',
    name: {
      en: 'Muscle Strength, Posture & Balance Routine',
      hi: 'मांसपेशियों की मजबूती और संतुलन (Balance) व्यायाम',
      mr: 'स्नायूंची ताकद आणि तोल सांभाळण्याचे व्यायाम',
    },
    category: {
      en: 'Bone Density & Sarcopenia Prevention',
      hi: 'हड्डियों और मांसपेशियों की शक्ति',
      mr: 'हाडांची घनता आणि स्नायूंचे आरोग्य',
    },
    duration: {
      en: '20 minutes (3 to 4 days a week)',
      hi: '20 मिनट (सप्ताह में 3 से 4 दिन)',
      mr: '२० मिनिटे (आठवड्यातून ३ ते ४ दिवस)',
    },
    intensity: {
      en: 'Moderate Controlled Resistance',
      hi: 'नियंत्रित शक्ति व्यायाम',
      mr: 'नियंत्रित स्नायू व्यायाम',
    },
    overview: {
      en: 'After age 40, the body naturally loses muscle mass (sarcopenia) and bone density. Simple bodyweight and wall-supported exercises keep bones strong and prevent fractures.',
      hi: '40 की उम्र के बाद मांसपेशियों और हड्डियों की ताकत कम होने लगती है। दीवार के सहारे किए जाने वाले सरल व्यायाम हड्डियों को मजबूत रखते हैं।',
      mr: 'वयाच्या ४० नंतर स्नायू आणि हाडांची ताकद हळूहळू कमी होते. भिंतीच्या आधाराने केलेले सोपे व्यायाम हाडे मजबूत ठेवतात आणि फ्रॅक्चर टाळतात.',
    },
    steps: {
      en: [
        'Wall Push-Ups: Stand arm’s length from a wall, place palms flat, bend elbows slowly toward the wall and push back (10 reps).',
        'Chair Sit-to-Stand: Rise slowly from a sturdy chair using leg strength and sit back gently with control (8–10 reps).',
        'Supported Heel Raises: Hold the back of a sturdy chair, rise onto your tiptoes for 3 seconds, and lower heels down (12 reps).',
        'Single-Leg Balance (Wall Supported): Touch a wall lightly and stand on one foot for 10 seconds to train balance nerves.',
      ],
      hi: [
        'वॉल पुश-अप्स: दीवार से एक हाथ की दूरी पर खड़े होकर हथेलियां टिकाएं और कोहनी मोड़ते हुए 10 बार पुश-अप करें।',
        'कुर्सी से उठना-बैठना (Sit-to-Stand): मजबूत कुर्सी से धीरे-धीरे खड़े हों और नियंत्रित रूप से बैठें (8–10 बार)।',
        'एड़ी उठाना (Heel Raises): कुर्सी का सहारा लेकर पंजों के बल एड़ी ऊपर उठाएं, 3 सेकंड रोकें और नीचे लाएं (12 बार)।',
        'संतुलन अभ्यास: दीवार को हल्का छूते हुए एक पैर पर 10 सेकंड खड़े रहने का अभ्यास करें।',
      ],
      mr: [
        'वॉल पुश-अप्स: भिंतीपासून एक हाताच्या अंतरावर उभे राहून तळहात भिंतीवर ठेवा आणि कोपरे वाकवून १० वेळा पुश-अप्स करा.',
        'खुर्चीवरून उठणे-बसणे (Sit-to-Stand): मजबूत खुर्चीवरून सावकाश उभे राहा आणि नियंत्रितपणे खाली बसा (८–१० वेळा).',
        'टाचा उचलणे (Heel Raises): खुर्चीचा आधार घेऊन चवड्यावर टाचा वर उचला, ३ सेकंद थांबा आणि खाली टेकवा (१२ वेळा).',
        'तोल सांभाळण्याचा सराव: भिंतीचा हलका आधार घेत एका पायावर १० सेकंद उभे राहण्याचा सराव करा.',
      ],
    },
    benefits: {
      en: [
        'Prevents age-related muscle loss (sarcopenia) and osteoporosis',
        'Improves insulin uptake by skeletal muscles for 24-hour glucose control',
        'Significantly reduces hip and wrist fracture risk from accidental slips',
      ],
      hi: [
        'उम्र के साथ होने वाली मांसपेशियों की कमजोरी और हड्डियों के खोखलेपन को रोकता है',
        'मांसपेशियों में ग्लूकोज की खपत बढ़ाकर डायबिटीज नियंत्रित रखता है',
        'अचानक फिसलने या गिरने से होने वाले फ्रैक्चर के खतरे को कम करता है',
      ],
      mr: [
        'वयोमानानुसार होणारी स्नायूंची झीज आणि हाडांचा ठिसूळपणा थांबवतो',
        'स्नायूंमध्ये साखरेचे ज्वलन वाढवून मधुमेह नियंत्रणात ठेवतो',
        'अचानक पाय घसरून होणाऱ्या खुब्याच्या किंवा मनगटाच्या फ्रॅक्चरचा धोका टाळतो',
      ],
    },
    precautions: {
      en: [
        'Always keep a sturdy chair or wall within arm’s reach during balance exercises.',
        'Breathe out during exertion; never hold your breath while lifting or pushing.',
      ],
      hi: [
        'संतुलन व्यायाम करते समय हमेशा पास में दीवार या मजबूत कुर्सी का सहारा रखें।',
        'व्यायाम के दौरान सांस न रोकें, सामान्य रूप से सांस लेते रहें।',
      ],
      mr: [
        'तोल सांभाळण्याचे व्यायाम करताना नेहमी जवळ भिंत किंवा मजबूत खुर्चीचा आधार ठेवा.',
        'व्यायाम करताना श्वास रोखून धरू नका, नैसर्गिक श्वसन सुरू ठेवा.',
      ],
    },
    ageRecommendations: {
      children: {
        en: 'Surya Namaskar, skipping rope, climbing, and bodyweight squats for healthy bone growth.',
        hi: 'हड्डियों के विकास के लिए सूर्य नमस्कार, रस्सी कूदना और खेलकूद।',
        mr: 'हाडांच्या उत्तम वाढीसाठी सूर्यनमस्कार, दोरीवरच्या उड्या आणि मैदानी खेळ.',
      },
      adults: {
        en: '3 days/week full-body resistance training (squats, lunges, push-ups, planks, Surya Namaskar).',
        hi: 'सप्ताह में 3 दिन स्क्वैट्स, पुश-अप्स, प्लैंक और 12 सूर्य नमस्कार।',
        mr: 'आठवड्यातून ३ दिवस स्क्वॅट्स, पुश-अप्स, प्लँक आणि १२ सूर्यनमस्कार.',
      },
      seniors: {
        en: 'Wall push-ups, chair sit-to-stand, and supported heel raises 3 times a week with wall support.',
        hi: 'दीवार और कुर्सी के सहारे वॉल पुश-अप्स और एड़ी उठाने का अभ्यास सप्ताह में 3 दिन।',
        mr: 'भिंत आणि खुर्चीच्या आधाराने वॉल पुश-अप्स व टाचा उचलण्याचा व्यायाम आठवड्यातून ३ दिवस.',
      },
    },
  },
];

export const AGE_EXERCISE_PLANS: AgeExercisePlan[] = [
  {
    ageGroupId: 'youth',
    ageRange: '0–18',
    label: {
      en: 'Children & Teens (0–18 Yrs)',
      hi: 'बच्चे और किशोर (0–18 वर्ष)',
      mr: 'लहान मुले व किशोरवयीन (०–१८ वर्षे)',
    },
    dailyTarget: {
      en: '60 Minutes of Active Outdoor Play & Yoga Daily',
      hi: 'प्रतिदिन 60 मिनट मैदानी खेल और योग',
      mr: 'दररोज ६० मिनिटे मैदानी खेळ आणि योगासने',
    },
    weeklySchedule: {
      en: [
        { activity: 'Outdoor Running, Football, Kho-Kho or Kabaddi', duration: '35–40 mins daily', focus: 'Cardiovascular stamina & agility' },
        { activity: 'Surya Namaskar & Tadasana (Tree Pose)', duration: '15 mins morning', focus: 'Height, spine posture & flexibility' },
        { activity: 'Cycling or Swimming', duration: '3–4 times/week', focus: 'Peak bone mineral density & coordination' },
      ],
      hi: [
        { activity: 'मैदानी खेल (दौड़, फुटबॉल, खो-खो, कबड्डी)', duration: 'रोज 35–40 मिनट', focus: 'स्टैमिना और शारीरिक फुर्ती' },
        { activity: 'सूर्य नमस्कार और ताड़ासन', duration: 'सुबह 15 मिनट', focus: 'लंबाई, रीढ़ की हड्डी और एकाग्रता' },
        { activity: 'साइकिल चलाना या तैराकी', duration: 'सप्ताह में 3–4 दिन', focus: 'मजबूत हड्डियां और मांसपेशियों का विकास' },
      ],
      mr: [
        { activity: 'मैदानी खेळ (धावणे, खो-खो, कबड्डी, फुटबॉल)', duration: 'दररोज ३५–४० मिनिटे', focus: 'शारीरिक दमदारपणा आणि चपळता' },
        { activity: 'सूर्यनमस्कार आणि ताडासन', duration: 'सकाळी १५ मिनिटे', focus: 'उंची, पाठीचा कणा आणि एकाग्रता' },
        { activity: 'सायकलिंग किंवा पोहणे', duration: 'आठवड्यातून ३–४ दिवस', focus: 'मजबूत हाडे आणि स्नायूंची वाढ' },
      ],
    },
    safetyTips: {
      en: ['Drink water before and after outdoor play', 'Limit recreational mobile/TV screen time to <90 mins/day'],
      hi: ['खेलने से पहले और बाद में पर्याप्त पानी पिएं', 'मोबाइल और टीवी स्क्रीन का समय 90 मिनट से कम रखें'],
      mr: ['खेळण्यापूर्वी आणि नंतर पुरेसे पाणी प्या', 'मोबाईल आणि टीव्ही पाहण्याची वेळ ९० मिनिटांपेक्षा कमी ठेवा'],
    },
  },
  {
    ageGroupId: 'young_adult',
    ageRange: '19–39',
    label: {
      en: 'Young Adults (19–39 Yrs)',
      hi: 'युवा वयस्क (19–39 वर्ष)',
      mr: 'तरुण वयोगट (१९–३९ वर्षे)',
    },
    dailyTarget: {
      en: '45 Minutes Cardio + Strength & Desk Mobility',
      hi: 'प्रतिदिन 45 मिनट कार्डियो, स्ट्रेंथ और योग',
      mr: 'दररोज ४५ मिनिटे कार्डिओ, स्ट्रेंथ आणि योगासने',
    },
    weeklySchedule: {
      en: [
        { activity: 'Brisk Walking, Jogging or Cycling', duration: '30 mins (5 days/wk)', focus: 'Heart fitness & metabolic calorie burn' },
        { activity: 'Strength Training (Squats, Push-ups, Dumbbells)', duration: '25 mins (3 days/wk)', focus: 'Lean muscle mass & insulin sensitivity' },
        { activity: 'Surya Namaskar, Neck & Spine Stretches', duration: '15 mins daily', focus: 'Counter sedentary desk posture & stress' },
      ],
      hi: [
        { activity: 'तेज चलना, जॉगिंग या साइकिलिंग', duration: '30 मिनट (सप्ताह में 5 दिन)', focus: 'हृदय स्वास्थ्य और वजन नियंत्रण' },
        { activity: 'स्ट्रेंथ ट्रेनिंग (स्क्वैट्स, पुश-अप्स, डंबल)', duration: '25 मिनट (सप्ताह में 3 दिन)', focus: 'मांसपेशियों की मजबूती और मेटाबॉलिज्म' },
        { activity: 'सूर्य नमस्कार और गर्दन/कमर स्ट्रेचिंग', duration: 'रोज 15 मिनट', focus: 'कंप्यूटर वर्क से होने वाले दर्द से बचाव' },
      ],
      mr: [
        { activity: 'भरभर चालणे, जॉगिंग किंवा सायकलिंग', duration: '३० मिनिटे (आठवड्यातून ५ दिवस)', focus: 'हृदयाचे आरोग्य आणि वजन नियंत्रण' },
        { activity: 'स्ट्रेंथ ट्रेनिंग (स्क्वॅट्स, पुश-अप्स, डंबेल्स)', duration: '२५ मिनिटे (आठवड्यातून ३ दिवस)', focus: 'स्नायूंची बळकटी आणि चयापचय सुधारणा' },
        { activity: 'सूर्यनमस्कार आणि मान/कंबर स्ट्रेचिंग', duration: 'दररोज १५ मिनिटे', focus: 'बैठ्या कामामुळे होणारी पाठदुखी टाळणे' },
      ],
    },
    safetyTips: {
      en: ['Always warm up for 5 minutes before intense workouts', 'Stand up and stretch for 2 minutes every hour during desk jobs'],
      hi: ['व्यायाम से पहले 5 मिनट वॉर्म-अप अवश्य करें', 'ऑफिस में हर 1 घंटे में 2 मिनट खड़े होकर स्ट्रेच करें'],
      mr: ['व्यायामापूर्वी ५ मिनिटे वॉर्म-अप नक्की करा', 'ऑफिसमध्ये दर १ तासाने २ मिनिटे उभे राहून शरीर स्ट्रेच करा'],
    },
  },
  {
    ageGroupId: 'middle_age',
    ageRange: '40–59',
    label: {
      en: 'Middle Age Adults (40–59 Yrs)',
      hi: 'मध्यम आयु वर्ग (40–59 वर्ष)',
      mr: 'मध्यम वयोगट (४०–५९ वर्षे)',
    },
    dailyTarget: {
      en: '35–45 Minutes Low-Impact Cardio, Yoga & Joint Care',
      hi: 'प्रतिदिन 35–45 मिनट तेज वॉक, योग और प्राणायाम',
      mr: 'दररोज ३५–४५ मिनिटे चालणे, योगासने आणि प्राणायाम',
    },
    weeklySchedule: {
      en: [
        { activity: 'Morning Brisk Walk + Post-Dinner Shatpavali', duration: '30 mins + 15 mins', focus: 'BP, Cholesterol & Blood Sugar control' },
        { activity: 'Low-Impact Resistance & Core Strengthening', duration: '20 mins (3 days/wk)', focus: 'Prevent knee wear & lower back pain' },
        { activity: 'Anulom-Vilom, Bhramari & Gentle Yoga Asanas', duration: '15 mins daily', focus: 'Stress reduction & hormonal balance' },
      ],
      hi: [
        { activity: 'सुबह की तेज वॉक + रात के खाने के बाद शतपावली', duration: '30 मिनट + 15 मिनट', focus: 'बीपी, कोलेस्ट्रॉल और शुगर नियंत्रण' },
        { activity: 'हल्का स्ट्रेंथ व्यायाम (वॉल पुश-अप्स, ब्रिज पोज)', duration: '20 मिनट (सप्ताह में 3 दिन)', focus: 'घुटनों और कमर को मजबूत रखना' },
        { activity: 'अनुलोम-विलोम, भ्रामरी और योगासन', duration: 'रोज 15 मिनट', focus: 'तनाव मुक्ति और गहरी नींद' },
      ],
      mr: [
        { activity: 'सकाळी भरभर चालणे + रात्री जेवणानंतर शतपावली', duration: '३० मिनिटे + १५ मिनिटे', focus: 'रक्तदाब, कोलेस्ट्रॉल आणि शुगर नियंत्रण' },
        { activity: 'सौम्य स्नायू व्यायाम (वॉल पुश-अप्स, कमर व्यायाम)', duration: '२० मिनिटे (आठवड्यातून ३ दिवस)', focus: 'गुडघे आणि कंबरेचे स्नायू मजबूत ठेवणे' },
        { activity: 'अनुलोम-विलोम, भ्रामरी आणि योगासने', duration: 'दररोज १५ मिनिटे', focus: 'मानसिक ताण कमी करणे आणि शांत झोप' },
      ],
    },
    safetyTips: {
      en: ['Avoid sudden high-impact jumping on hard concrete', 'Check BP before starting heavy exercise if hypertensive'],
      hi: ['कठोर जमीन पर अचानक कूदने वाले व्यायाम न करें', 'हाई बीपी होने पर नियमित जांच करें और सांस न रोकें'],
      mr: ['सिमेंटच्या कठीण जमिनीवर उड्या मारण्याचे व्यायाम टाळा', 'उच्च रक्तदाब असल्यास व्यायाम करताना श्वास रोखून धरू नका'],
    },
  },
  {
    ageGroupId: 'seniors',
    ageRange: '60+',
    label: {
      en: 'Senior Citizens (60+ Yrs)',
      hi: 'वरिष्ठ नागरिक (60+ वर्ष)',
      mr: 'ज्येष्ठ नागरिक (६०+ वर्षे)',
    },
    dailyTarget: {
      en: '30 Minutes Gentle Walk, Chair Yoga & Balance Care',
      hi: 'प्रतिदिन 30 मिनट सहज टहलना, चेयर योग और प्राणायाम',
      mr: 'दररोज ३० मिनिटे संथ चालणे, खुर्चीवरील योग आणि प्राणायाम',
    },
    weeklySchedule: {
      en: [
        { activity: 'Morning Sunlight Walk & Evening Shatpavali', duration: '20 mins + 15 mins', focus: 'Vitamin D absorption, digestion & circulation' },
        { activity: 'Seated Chair Yoga (Knee Extensions & Ankle Circles)', duration: '15–20 mins daily', focus: 'Arthritis relief & joint lubrication' },
        { activity: 'Wall-Supported Heel Raises & Balance Practice', duration: '10 mins (3 days/wk)', focus: 'Fall prevention & leg stability' },
        { activity: 'Anulom-Vilom & Bhramari Pranayama', duration: '15 mins daily', focus: 'Lung strength, BP calmness & peaceful sleep' },
      ],
      hi: [
        { activity: 'सुबह की गुनगुनी धूप में टहलना + शाम की शतपावली', duration: '20 मिनट + 15 मिनट', focus: 'विटामिन D, पाचन और रक्त संचार' },
        { activity: 'चेयर योग (कुर्सी पर बैठकर घुटने और टखने के व्यायाम)', duration: 'रोज 15–20 मिनट', focus: 'गठिया दर्द में राहत और जोड़ों की गतिशीलता' },
        { activity: 'दीवार के सहारे एड़ी उठाना और संतुलन अभ्यास', duration: '10 मिनट (सप्ताह में 3 दिन)', focus: 'गिरने से बचाव और पैरों की मजबूती' },
        { activity: 'अनुलोम-विलोम और भ्रामरी प्राणायाम', duration: 'रोज 15 मिनट', focus: 'फेफड़ों की ताकत, शांत बीपी और अच्छी नींद' },
      ],
      mr: [
        { activity: 'सकाळच्या कोवळ्या उन्हात चालणे + संध्याकाळी शतपावली', duration: '२० मिनिटे + १५ मिनिटे', focus: 'व्हिटॅमिन D, पचन आणि रक्ताभिसरण' },
        { activity: 'खुर्चीवरील योग (बसून गुडघे व घोट्यांचे सूक्ष्म व्यायाम)', duration: 'दररोज १५–२० मिनिटे', focus: 'संधिवात आराम आणि सांध्यांची लवचिकता' },
        { activity: 'भिंतीच्या आधाराने टाचा उचलणे व तोल सराव', duration: '१० मिनिटे (आठवड्यातून ३ दिवस)', focus: 'पडण्यापासून बचाव आणि पायांची स्थिरता' },
        { activity: 'अनुलोम-विलोम आणि भ्रामरी प्राणायाम', duration: 'दररोज १५ मिनिटे', focus: 'फुफ्फुसांची क्षमता, रक्तदाब नियंत्रण व शांत झोप' },
      ],
    },
    safetyTips: {
      en: [
        'Always exercise in a well-lit room with a sturdy chair or wall support nearby',
        'Sip warm water regularly; do not walk outdoors on slippery wet monsoon pavements',
      ],
      hi: [
        'हमेशा पर्याप्त रोशनी वाले स्थान पर दीवार या मजबूत कुर्सी के पास अभ्यास करें',
        'बारिश या फिसलन वाले रास्ते पर बाहर टहलने के बजाय घर के अंदर शतपावली करें',
      ],
      mr: [
        'नेहमी पुरेशा प्रकाशात आणि मजबूत खुर्ची किंवा भिंतीच्या आधाराजवळ व्यायाम करा',
        'पावसाळ्यात निसरड्या रस्त्यावर चालण्याऐवजी घरात किंवा व्हरांड्यात शतपावली करा',
      ],
    },
  },
];

export const DISEASES_LIBRARY: DiseaseInfo[] = [
  {
    id: 'hypertension',
    name: {
      en: 'Hypertension (High Blood Pressure)',
      hi: 'उच्च रक्तचाप (हाई ब्लड प्रेशर)',
      mr: 'उच्च रक्तदाब (हाय ब्लड प्रेशर)',
    },
    category: {
      en: 'Cardiovascular Health',
      hi: 'हृदय स्वास्थ्य',
      mr: 'हृदय आरोग्य',
    },
    overview: {
      en: 'Persistent elevation of blood pressure in the arteries (≥130/80 mmHg). Often called a silent condition because it rarely shows early warning signs.',
      hi: 'धमनियों में रक्तचाप का लगातार बढ़ना (≥130/80 mmHg)। इसे साइलेंट किलर भी कहा जाता है क्योंकि इसके शुरुआती लक्षण कम दिखते हैं।',
      mr: 'रक्तवाहिन्यांमधील रक्तदाब सतत वाढणे (≥130/80 mmHg). याला सायलेंट आजार मानले जाते कारण सुरुवातीला स्पष्ट लक्षणे दिसत नाहीत.',
    },
    symptoms: {
      en: [
        'Early morning occipital headaches or dizziness',
        'Shortness of breath during light walking',
        'Palpitations or chest tightness',
        'Blurred vision or nosebleeds in severe spikes',
      ],
      hi: [
        'सुबह के समय सिर के पिछले हिस्से में दर्द या चक्कर आना',
        'थोड़ा चलने पर सांस फूलना',
        'धड़कन तेज होना या सीने में भारीपन',
        'धुंधला दिखना या गंभीर स्थिति में नाक से खून आना',
      ],
      mr: [
        'सकाळी डोक्याच्या मागील बाजूस दुखणे किंवा चक्कर येणे',
        'थोडे चालल्यावर दम लागणे',
        'छातीत धडधडणे किंवा जडपणा जाणवणे',
        'अंधूक दिसणे किंवा तीव्र रक्तदाबात नाकातून रक्त येणे',
      ],
    },
    prevention: {
      en: [
        'Limit daily salt (sodium) intake to less than 5 grams (1 teaspoon) per day',
        'Practice 30 minutes of brisk walking and Pranayama breathing daily',
        'Monitor blood pressure twice a week and log readings consistently',
        'Avoid tobacco, smoking, and processed packaged snacks',
      ],
      hi: [
        'प्रतिदिन नमक का सेवन 5 ग्राम (1 छोटा चम्मच) से कम रखें',
        'रोजाना 30 मिनट तेज पैदल चलें और प्राणायाम करें',
        'सप्ताह में दो बार बीपी जांचें और डायरी या ऐप में दर्ज करें',
        'तंबाकू, धूम्रपान और पैकेटबंद नमकीन खाद्य पदार्थों से बचें',
      ],
      mr: [
        'दररोज मिठाचे प्रमाण ५ ग्रॅमपेक्षा (१ लहान चमचा) कमी ठेवा',
        'दररोज ३० मिनिटे चालण्याचा व्यायाम आणि प्राणायाम करा',
        'आठवड्यातून दोनदा रक्तदाब तपासा आणि नोंद ठेवा',
        'तंबाखू, धूम्रपान आणि पॅबंद खारट पदार्थ टाळा',
      ],
    },
    dietByAge: {
      children: {
        en: 'Fresh seasonal fruits, homemade dal-roti, minimal chips/instant noodles.',
        hi: 'ताजे मौसमी फल, घर का बना दाल-रोटी, चिप्स और इंस्टेंट नूडल्स से परहेज।',
        mr: 'ताजी हंगामी फळे, घरचा वरण-भात व पोळी, चिप्स आणि फास्ट फूड टाळा.',
      },
      adults: {
        en: 'DASH diet rich in potassium: spinach, banana, oats, sprouts, and low-sodium buttermilk.',
        hi: 'पोटैशियम युक्त आहार: पालक, केला, ओट्स, अंकुरित अनाज और कम नमक वाली छाछ।',
        mr: 'पोटॅशियमयुक्त आहार: पालक, केळी, ओट्स, मोड आलेली कडधान्ये आणि कमी मिठाचे ताक.',
      },
      seniors: {
        en: 'Soft warm meals:lauki/ridge gourd sabzi, garlic-infused dal, roasted flaxseeds, and steamed greens.',
        hi: 'हल्का और सुपाच्य भोजन: लौकी-तोरी की सब्जी, लहसुन वाली दाल, भुने अलसी के बीज और हरी सब्जियां।',
        mr: 'पचायला हलका आहार: दुधी भोपळा, लसूण घातलेले वरण, भाजलेली जवस आणि हिरव्या पालेभाज्या.',
      },
    },
  },
  {
    id: 'diabetes',
    name: {
      en: 'Type 2 Diabetes Mellitus',
      hi: 'टाइप 2 मधुमेह (शुगर)',
      mr: 'टाईप २ मधुमेह (डायबिटीज / साखर)',
    },
    category: {
      en: 'Metabolic Care',
      hi: 'चयापचय स्वास्थ्य',
      mr: 'चयापचय आरोग्य',
    },
    overview: {
      en: 'Chronic metabolic condition where the body resists insulin or produces insufficient insulin, causing elevated blood glucose levels.',
      hi: 'एक दीर्घकालिक स्थिति जिसमें शरीर इंसुलिन का सही उपयोग नहीं कर पाता, जिससे रक्त में शर्करा (शुगर) का स्तर बढ़ जाता है।',
      mr: 'शरीरातील इन्सुलिनची कार्यक्षमता कमी झाल्यामुळे रक्तातील साखरेचे प्रमाण वाढणारा दीर्घकालीन आजार.',
    },
    symptoms: {
      en: [
        'Frequent urination (especially at night) and excessive thirst',
        'Unexplained fatigue and slow-healing foot cuts or sores',
        'Tingling or numbness in hands and feet',
        'Increased hunger and sudden blurry vision',
      ],
      hi: [
        'बार-बार पेशाब आना (विशेषकर रात में) और अधिक प्यास लगना',
        'बिना कारण थकान और पैरों के घाव देरी से भरना',
        'हाथों और पैरों में झुनझुनी या सुन्नपन',
        'अधिक भूख लगना और दृष्टि धुंधली होना',
      ],
      mr: [
        'वारंवार लघवीला होणे (विशेषतः रात्री) आणि खूप तहान लागणे',
        'सतत थकवा जाणवणे आणि पायांच्या जखमा लवकर न भरणे',
        'हातापायांना मुंग्या येणे किंवा बधिरपणा जाणवणे',
        'भूक वाढणे आणि दृष्टी अंधूक होणे',
      ],
    },
    prevention: {
      en: [
        'Replace refined white rice and maida with whole grains (jowar, bajra, ragi)',
        'Take a 15-minute gentle walk after lunch and dinner to stabilize post-meal glucose',
        'Get HbA1c and fasting blood glucose screened every 3 to 6 months',
        'Inspect feet daily for blisters or cuts, especially for elderly patients',
      ],
      hi: [
        'सफेद चावल और मैदे के स्थान पर ज्वार, बाजरा, रागी और चोकर युक्त आटे का प्रयोग करें',
        'दोपहर और रात के भोजन के बाद 15 मिनट धीरे-धीरे टहलें',
        'हर 3 से 6 महीने में फास्टिंग शुगर और HbA1c की जांच करवाएं',
        'बुजुर्ग मरीज रोज अपने पैरों की जांच करें कि कोई छाला या कट न हो',
      ],
      mr: [
        'मैदा आणि पांढऱ्या भाताऐवजी ज्वारी, बाजरी, नाचणी (रागी) भाकरीचा समावेश करा',
        'दुपारच्या आणि रात्रीच्या जेवणानंतर १५ मिनिटे शतपावली करा',
        'दर ३ ते ६ महिन्यांनी फास्टिंग शुगर आणि HbA1c तपासणी करा',
        'ज्येष्ठ नागरिकांनी दररोज तळपायांची काळजीपूर्वक पाहणी करावी',
      ],
    },
    dietByAge: {
      children: {
        en: 'Avoid sugary sodas and candies; focus on whole fruits, milk, eggs, and outdoor play.',
        hi: 'मीठे कोल्ड ड्रिंक्स और चॉकलेट से बचें; साबुत फल, दूध, दाल और खेलकूद पर ध्यान दें।',
        mr: 'गोड शीतपेये व चॉकलेट टाळा; ताजी फळे, दूध, अंडी आणि मैदानी खेळांवर भर द्या.',
      },
      adults: {
        en: 'High-fiber plate method: 50% green vegetables (karela, methi), 25% protein (paneer, moong dal), 25% multigrain roti.',
        hi: 'हाई-फाइबर थाली: 50% हरी सब्जियां (करेला, मेथी), 25% प्रोटीन (मूंग दाल, पनीर), 25% मल्टीग्रेन रोटी।',
        mr: 'हाय-फायबर थाळी: ५०% हिरव्या भाज्या (कारले, मेथी), २५% प्रथिने (मूग डाळ, पनीर), २५% ज्वारी/मल्टीग्रेन भाकरी.',
      },
      seniors: {
        en: 'Small frequent meals every 3 hours: ragi porridge, soaked fenugreek seeds water, roasted chana, and warm vegetable soup.',
        hi: 'हर 3 घंटे में थोड़ा भोजन: रागी दलिया, भीगे मेथी दाने का पानी, भुना चना और गर्म सूप।',
        mr: 'दर ३ तासांनी थोडे भोजन: नाचणीची पेज, भिजवलेल्या मेथीचे पाणी, भाजलेले चणे आणि भाज्यांचे सूप.',
      },
    },
  },
  {
    id: 'vector_borne',
    name: {
      en: 'Dengue & Malaria (Vector-Borne Fevers)',
      hi: 'डेंगू और मलेरिया (मच्छर जनित बुखार)',
      mr: 'डेंग्यू आणि मलेरिया (डासांमुळे होणारे ताप)',
    },
    category: {
      en: 'Infectious Disease Prevention',
      hi: 'संक्रामक रोग बचाव',
      mr: 'संसर्गजन्य रोग प्रतिबंध',
    },
    overview: {
      en: 'Mosquito-borne acute febrile illnesses common during and after monsoon. Early hydration and platelet monitoring save lives.',
      hi: 'मानसून के दौरान मच्छरों से फैलने वाले तेज बुखार। समय पर पानी की पूर्ति और प्लेटलेट्स की निगरानी अत्यंत आवश्यक है।',
      mr: 'पावसाळ्यात डासांमुळे पसरणारे तीव्र ताप. वेळेवर जलसंजीवनी (पाणी) आणि प्लेटलेट्सची तपासणी महत्त्वाची ठरते.',
    },
    symptoms: {
      en: [
        'Sudden high fever (102°F–104°F) with chills and rigor',
        'Severe pain behind the eyes, joint pain, and muscle aches',
        'Skin rash, nausea, or bleeding gums in warning stages',
        'Extreme weakness and drop in urine output',
      ],
      hi: [
        'ठंड और कंपकंपी के साथ अचानक तेज बुखार (102°F–104°F)',
        'आंखों के पीछे तेज दर्द, जोड़ों और मांसपेशियों में जकड़न',
        'त्वचा पर लाल चकत्ते, जी मिचलाना या मसूड़ों से खून आना',
        'अत्यधिक कमजोरी और पेशाब कम आना',
      ],
      mr: [
        'थंडी वाजून अचानक येणारा तीव्र ताप (102°F–104°F)',
        'डोळ्यांच्या मागे तीव्र वेदना, सांधेदुखी आणि अंगदुखी',
        'अंगावर लाल पुरळ, मळमळ किंवा हिरड्यांमधून रक्त येणे',
        'तीव्र अशक्तपणा आणि लघवीचे प्रमाण कमी होणे',
      ],
    },
    prevention: {
      en: [
        'Empty stagnant water from flower pots, coolers, and terrace containers every week',
        'Use mosquito nets while sleeping and wear full-sleeved light cotton clothes',
        'Never self-medicate with Ibuprofen or Aspirin during suspected dengue fever (use only Paracetamol as advised)',
        'Seek blood CBC test within 24 hours of high monsoon fever',
      ],
      hi: [
        'गमलों, कूलर और छत के बर्तनों में जमा पानी हर सप्ताह साफ करें',
        'सोते समय मच्छरदानी का प्रयोग करें और पूरी बाजू के सूती कपड़े पहनें',
        'डेंगू के संदेह में बिना डॉक्टर की सलाह के दर्द निवारक दवाएं (एस्पिरिन/ब्रूफेन) कभी न लें',
        'तेज बुखार होने पर 24 घंटे के भीतर सीबीसी (CBC) रक्त जांच करवाएं',
      ],
      mr: [
        'कुंड्या, कूलर आणि गच्चीवरील साचलेले पाणी दर आठवड्याला रिकामे करा',
        'झोपताना मच्छरदाणी वापरा आणि पूर्ण बाह्यांचे सुती कपडे घाला',
        'डेंग्यूचा संशय असल्यास डॉक्टरांच्या सल्ल्याशिवाय वेदनाशामक गोळ्या (Ibuprofen/Aspirin) घेऊ नका',
        'तीव्र ताप आल्यास २४ तासांत CBC रक्त तपासणी करून घ्या',
      ],
    },
    dietByAge: {
      children: {
        en: 'ORS solution, tender coconut water, mashed banana, and soft khichdi.',
        hi: 'ओआरएस (ORS) का घोल, नारियल पानी, मसला हुआ केला और पतली खिचड़ी।',
        mr: 'ओआरएस (ORS) पाणी, शहाळ्याचे पाणी, केळी आणि मऊ खिचडी.',
      },
      adults: {
        en: '3+ liters of fluids daily: pomegranate juice, kiwi/guava, moong dal soup, and turmeric milk.',
        hi: 'प्रतिदिन 3 लीटर से अधिक तरल: अनार का रस, अमरूद, मूंग दाल का पानी और हल्दी दूध।',
        mr: 'दररोज ३ लिटरपेक्षा जास्त द्रव पदार्थ: डाळिंबाचा रस, पेरू, मुगाचे कढण आणि हळदीचे दूध.',
      },
      seniors: {
        en: 'Warm ORS sips every 30 minutes, clear vegetable broth, soft rice kanji, and boiled apple puree.',
        hi: 'हर 30 मिनट में ओआरएस के घूंट, सब्जियों का सूप, चावल की कांजी और उबले सेब की प्यूरी।',
        mr: 'दर ३० मिनिटांनी कोमट पाणी/ORS, भाज्यांचे सूप, भाताची पेज आणि उकडलेले सफरचंद.',
      },
    },
  },
  {
    id: 'arthritis_bone',
    name: {
      en: 'Osteoarthritis & Senior Bone Health',
      hi: 'गठिया (आर्थराइटिस) और हड्डियों का स्वास्थ्य',
      mr: 'संधिवात आणि हाडांचे आरोग्य',
    },
    category: {
      en: 'Geriatric & Mobility Care',
      hi: 'वरिष्ठ नागरिक देखभाल',
      mr: 'ज्येष्ठ नागरिक अस्थिरोग काळजी',
    },
    overview: {
      en: 'Gradual wear of joint cartilage and bone mineral density loss, affecting knees, hips, and spine in older adults.',
      hi: 'उम्र बढ़ने के साथ जोड़ों के कार्टिलेज का घिसना और हड्डियों में कैल्शियम की कमी, जिससे घुटनों और कमर में दर्द होता है।',
      mr: 'वयोमानानुसार सांध्यांमधील कूर्चा झिजणे आणि हाडांची घनता कमी होणे, ज्यामुळे गुडघे व कंबरदुखी उद्भवते.',
    },
    symptoms: {
      en: [
        'Morning joint stiffness lasting 15–30 minutes',
        'Knee pain while climbing stairs or rising from a chair',
        'Mild swelling or creaking sound (crepitus) in knees',
        'Reduced grip strength and back posture stooping',
      ],
      hi: [
        'सुबह उठने पर जोड़ों में 15–30 मिनट तक जकड़न रहना',
        'सीढ़ियां चढ़ते समय या कुर्सी से उठते समय घुटनों में दर्द',
        'घुटनों में हल्की सूजन या कट-कट की आवाज आना',
        'हाथों की पकड़ कमजोर होना और पीठ में झुकाव',
      ],
      mr: [
        'सकाळी उठल्यावर १५ ते ३० मिनिटे सांधे आखडणे',
        'पायऱ्या चढताना किंवा खुर्चीवरून उठताना गुडघे दुखणे',
        'गुडघ्यांवर हलकी सूज किंवा आवाज येणे',
        'हाताची पकड कमी होणे आणि कंबर वाकणे',
      ],
    },
    prevention: {
      en: [
        'Get 20 minutes of morning sunlight (before 9 AM) daily for natural Vitamin D synthesis',
        'Perform seated knee extension exercises and low-impact swimming or walking',
        'Install anti-slip mats and grab bars in bathrooms to prevent senior falls',
        'Maintain healthy body weight to reduce mechanical load on knee joints',
      ],
      hi: [
        'विटामिन डी के लिए रोज सुबह 9 बजे से पहले 20 मिनट धूप में बैठें',
        'कुर्सी पर बैठकर घुटने के हल्के व्यायाम करें और समतल जमीन पर टहलें',
        'बुजुर्गों को गिरने से बचाने के लिए बाथरूम में एंटी-स्लिप मैट और हैंडल लगाएं',
        'घुटनों पर दबाव कम करने के लिए वजन नियंत्रित रखें',
      ],
      mr: [
        'व्हिटॅमिन डी साठी दररोज सकाळी ९ पूर्वी २० मिनिटे कोवळ्या उन्हात बसा',
        'खुर्चीवर बसून गुडघ्यांचे हलके व्यायाम करा आणि सपाट जागेवर चाला',
        'ज्येष्ठांना घसरून पडण्यापासून वाचवण्यासाठी बाथरूममध्ये अँटी-स्लिप मॅट व आधार दांडे बसवा',
        'गुडघ्यांवरील ताण कमी करण्यासाठी वजन नियंत्रित ठेवा',
      ],
    },
    dietByAge: {
      children: {
        en: '2 glasses of milk/curd daily, ragi malt, almonds, and outdoor sports for peak bone mass.',
        hi: 'रोज 2 गिलास दूध/दही, रागी माल्ट, बादाम और मजबूत हड्डियों के लिए खेलकूद।',
        mr: 'दररोज २ ग्लास दूध/दही, नाचणी सत्व, बदाम आणि मैदानी खेळ.',
      },
      adults: {
        en: 'Calcium & Vitamin D rich foods: sesame seeds (til), paneer, curd, drumstick (shevga) soup, and walnuts.',
        hi: 'कैल्शियम और विटामिन डी युक्त आहार: तिल, पनीर, दही, सहजन (मोरिंगा) का सूप और अखरोट।',
        mr: 'कॅल्शियम व व्हिटॅमिन डी युक्त आहार: तीळ, पनीर, दही, शेवग्याच्या शेंगांचे सूप आणि अक्रोड.',
      },
      seniors: {
        en: 'Warm turmeric-ginger milk at night, ragi bhakri, roasted makhana (foxnuts), and doctor-advised Vitamin D3/Calcium.',
        hi: 'रात में गर्म हल्दी-सौंठ वाला दूध, रागी की रोटी, भुने मखाने और डॉक्टर द्वारा निर्देशित कैल्शियम।',
        mr: 'रात्री हळद-सुंठ घातलेले कोमट दूध, नाचणीची भाकरी, भाजलेले मखाने आणि डॉक्टरांच्या सल्ल्याने कॅल्शियम.',
      },
    },
  },
];

export const AGE_SCREENING_RECOMMENDATIONS: AgeScreeningRecommendation[] = [
  {
    ageGroupId: 'youth',
    ageRange: '0–18',
    label: {
      en: 'Children & Adolescents (0–18 Yrs)',
      hi: 'बच्चे और किशोर (0–18 वर्ष)',
      mr: 'लहान मुले आणि किशोरवयीन (०–१८ वर्षे)',
    },
    screenings: {
      en: [
        { test: 'Growth & BMI Percentile Check', frequency: 'Every 6 Months', reason: 'Track height, weight, and nutritional milestones' },
        { test: 'Vision & Dental Acuity Screening', frequency: 'Annually', reason: 'Detect early myopia or dental cavities during school years' },
        { test: 'Hemoglobin (Anemia) Screening', frequency: 'Annually', reason: 'Prevent iron-deficiency anemia in growing children' },
      ],
      hi: [
        { test: 'लंबाई, वजन और बीएमआई जांच', frequency: 'हर 6 महीने में', reason: 'शारीरिक विकास और पोषण की निगरानी के लिए' },
        { test: 'आंखों और दांतों की जांच', frequency: 'वर्ष में एक बार', reason: 'दृष्टि दोष और दांतों की सड़न का समय पर पता लगाने के लिए' },
        { test: 'हीमोग्लोबिन (एनीमिया) जांच', frequency: 'वर्ष में एक बार', reason: 'बच्चों में खून की कमी (आयरन की कमी) रोकने के लिए' },
      ],
      mr: [
        { test: 'उंची, वजन आणि बीएमआय तपासणी', frequency: 'दर ६ महिन्यांनी', reason: 'शारीरिक वाढ आणि पोषणाचा मागोवा घेण्यासाठी' },
        { test: 'डोळे आणि दातांची तपासणी', frequency: 'वर्षातून एकदा', reason: 'दृष्टीदोष आणि दातांची कीड लवकर ओळखण्यासाठी' },
        { test: 'हिमोग्लोबिन (ॲनिमिया) चाचणी', frequency: 'वर्षातून एकदा', reason: 'वाढत्या वयात रक्ताची कमतरता टाळण्यासाठी' },
      ],
    },
    dietaryFocus: {
      en: ['Protein-rich dal, milk, eggs/paneer for growth', 'Iron-rich jaggery, spinach, dates, and pomegranate', 'Zero ultra-processed sugary drinks'],
      hi: ['शारीरिक विकास के लिए दाल, दूध, पनीर/अंडे', 'आयरन के लिए गुड़, पालक, खजूर और अनार', 'डिब्बाबंद मीठे पेयों से पूर्ण परहेज'],
      mr: ['वाढीसाठी वरण, दूध, पनीर/अंडी यांचा समावेश', 'लोहासाठी गूळ, पालक, खजूर आणि डाळिंब', 'पॅकबंद गोड शीतपेये पूर्णपणे टाळा'],
    },
    sleepTarget: {
      en: '9 to 11 hours of uninterrupted night sleep',
      hi: 'रात में 9 से 11 घंटे की गहरी नींद',
      mr: 'रात्री ९ ते ११ तास सलग शांत झोप',
    },
  },
  {
    ageGroupId: 'young_adult',
    ageRange: '19–39',
    label: {
      en: 'Young Adults (19–39 Yrs)',
      hi: 'युवा वयस्क (19–39 वर्ष)',
      mr: 'तरुण वयोगट (१९–३९ वर्षे)',
    },
    screenings: {
      en: [
        { test: 'Blood Pressure & Fasting Lipid Profile', frequency: 'Every 1–2 Years', reason: 'Early baseline for heart and arterial wellness' },
        { test: 'Fasting Blood Sugar & HbA1c', frequency: 'Every 2 Years', reason: 'Screen for pre-diabetes caused by sedentary work' },
        { test: 'Vitamin D & Vitamin B12 Panel', frequency: 'Annually', reason: 'Address common nutritional deficiencies causing fatigue' },
      ],
      hi: [
        { test: 'ब्लड प्रेशर और लिपिड प्रोफाइल (कोलेस्ट्रॉल)', frequency: 'हर 1–2 वर्ष में', reason: 'हृदय और धमनियों के स्वास्थ्य की शुरुआती जांच' },
        { test: 'फास्टिंग ब्लड शुगर और HbA1c', frequency: 'हर 2 वर्ष में', reason: 'प्री-डायबिटीज की समय पर पहचान के लिए' },
        { test: 'विटामिन D और विटामिन B12 जांच', frequency: 'वर्ष में एक बार', reason: 'थकान और नसों की कमजोरी दूर करने के लिए' },
      ],
      mr: [
        { test: 'रक्तदाब आणि लिपिड प्रोफाईल (कोलेस्ट्रॉल)', frequency: 'दर १–२ वर्षांनी', reason: 'हृदयाच्या आरोग्याची प्राथमिक तपासणी' },
        { test: 'फास्टिंग ब्लड शुगर आणि HbA1c', frequency: 'दर २ वर्षांनी', reason: 'बैठ्या कामामुळे होणारा प्री-डायबिटीज ओळखण्यासाठी' },
        { test: 'व्हिटॅमिन D आणि B12 तपासणी', frequency: 'वर्षातून एकदा', reason: 'थकवा आणि जीवनसत्त्वांची कमतरता टाळण्यासाठी' },
      ],
    },
    dietaryFocus: {
      en: ['High-fiber whole grains & sprouted legumes', 'Omega-3 from walnuts, flaxseeds, and fish', '2.5–3L daily hydration with buttermilk/lemon water'],
      hi: ['साबुत अनाज और अंकुरित दालें (स्प्राउट्स)', 'अखरोट और अलसी के बीजों से ओमेगा-3', 'प्रतिदिन 2.5–3 लीटर पानी, छाछ और नींबू पानी'],
      mr: ['संपूर्ण धान्य आणि मोड आलेली कडधान्ये', 'अक्रोड आणि जवसापासून ओमेगा-३', 'दररोज २.५ ते ३ लिटर पाणी, ताक आणि लिंबू पाणी'],
    },
    sleepTarget: {
      en: '7 to 9 hours (Screen-off 45 mins before bed)',
      hi: '7 से 9 घंटे (सोने से 45 मिनट पहले मोबाइल बंद करें)',
      mr: '७ ते ९ तास (झोपण्यापूर्वी ४५ मिनिटे मोबाईल बंद करा)',
    },
  },
  {
    ageGroupId: 'middle_age',
    ageRange: '40–59',
    label: {
      en: 'Middle Age Adults (40–59 Yrs)',
      hi: 'मध्यम आयु वर्ग (40–59 वर्ष)',
      mr: 'मध्यम वयोगट (४०–५९ वर्षे)',
    },
    screenings: {
      en: [
        { test: 'Comprehensive Cardiac Check (ECG & Lipids)', frequency: 'Annually', reason: 'Prevent coronary heart disease and hypertension' },
        { test: 'HbA1c, Kidney (KFT) & Liver Function (LFT)', frequency: 'Every 6–12 Months', reason: 'Monitor metabolic and organ health' },
        { test: 'Mammogram / Cervical or Prostate Screening', frequency: 'Every 1–2 Years', reason: 'Early preventive oncology detection' },
        { test: 'Intraocular Pressure (Glaucoma) & Presbyopia Check', frequency: 'Annually', reason: 'Protect aging vision' },
      ],
      hi: [
        { test: 'हृदय जांच (ECG और लिपिड प्रोफाइल)', frequency: 'वर्ष में एक बार', reason: 'हृदय रोग और हाई बीपी से बचाव के लिए' },
        { test: 'HbA1c, किडनी (KFT) और लिवर (LFT) जांच', frequency: 'हर 6–12 महीने में', reason: 'प्रमुख अंगों के स्वास्थ्य की निगरानी के लिए' },
        { test: 'मैमोग्राफी / सर्वाइकल या प्रोस्टेट जांच', frequency: 'हर 1–2 वर्ष में', reason: 'कैंसर की प्रारंभिक रोकथाम और पहचान के लिए' },
        { test: 'आंखों के दबाव (ग्लूकोमा) की जांच', frequency: 'वर्ष में एक बार', reason: 'बढ़ती उम्र में आंखों की रोशनी सुरक्षित रखने के लिए' },
      ],
      mr: [
        { test: 'हृदय तपासणी (ECG आणि लिपिड प्रोफाईल)', frequency: 'वर्षातून एकदा', reason: 'हृदयरोग आणि उच्च रक्तदाब टाळण्यासाठी' },
        { test: 'HbA1c, किडनी (KFT) आणि लिव्हर (LFT) चाचणी', frequency: 'दर ६–१२ महिन्यांनी', reason: 'मुख्य अवयवांच्या आरोग्यावर लक्ष ठेवण्यासाठी' },
        { test: 'मॅमोग्राफी / गर्भाशय मुख किंवा प्रोस्टेट तपासणी', frequency: 'दर १–२ वर्षांनी', reason: 'कर्करोगाचे लवकर निदान व प्रतिबंध करण्यासाठी' },
        { test: 'काचबिंदू (ग्लुकोमा) आणि डोळ्यांची तपासणी', frequency: 'वर्षातून एकदा', reason: 'दृष्टी सुरक्षित ठेवण्यासाठी' },
      ],
    },
    dietaryFocus: {
      en: ['Low-oil, low-sodium cooking (<5g salt/day)', 'Millets (Jowar/Bajra) instead of refined carbs', 'Antioxidant-rich leafy greens and turmeric'],
      hi: ['कम तेल और कम नमक वाला भोजन (<5 ग्राम नमक/दिन)', 'मैदे की जगह ज्वार और बाजरे की रोटी', 'हरी पत्तेदार सब्जियां और हल्दी-आंवला का सेवन'],
      mr: ['कमी तेल आणि कमी मिठाचा आहार (दिवसाला <५ ग्रॅम मीठ)', 'गव्हाऐवजी ज्वारी व बाजरीची भाकरी', 'हिरव्या पालेभाज्या, आवळा आणि हळदीचा वापर'],
    },
    sleepTarget: {
      en: '7 to 8 hours with fixed wake-up schedule',
      hi: '7 से 8 घंटे (निश्चित समय पर सोना और उठना)',
      mr: '७ ते ८ तास (झोपण्याची व उठण्याची निश्चित वेळ)',
    },
  },
  {
    ageGroupId: 'seniors',
    ageRange: '60+',
    label: {
      en: 'Senior Citizens (60+ Yrs)',
      hi: 'वरिष्ठ नागरिक (60+ वर्ष)',
      mr: 'ज्येष्ठ नागरिक (६०+ वर्षे)',
    },
    screenings: {
      en: [
        { test: 'BP, Blood Sugar & Electrolytes Check', frequency: 'Monthly / Quarterly', reason: 'Prevent dizziness, strokes, and sodium imbalance' },
        { test: 'DEXA Bone Density & Vitamin D/Calcium Check', frequency: 'Every 1–2 Years', reason: 'Prevent osteoporosis and hip fractures' },
        { test: 'Cataract, Retinal & Hearing Assessment', frequency: 'Every 6–12 Months', reason: 'Maintain independence and cognitive engagement' },
        { test: 'Annual Influenza & Pneumococcal Vaccination Review', frequency: 'Annually', reason: 'Protect lungs against severe pneumonia' },
      ],
      hi: [
        { test: 'बीपी, ब्लड शुगर और इलेक्ट्रोलाइट्स जांच', frequency: 'मासिक / तिमाही', reason: 'चक्कर आना, स्ट्रोक और कमजोरी से बचाव के लिए' },
        { test: 'हड्डियों की मजबूती (DEXA) और कैल्शियम जांच', frequency: 'हर 1–2 वर्ष में', reason: 'हड्डियों के फ्रैक्चर और ऑस्टियोपोरोसिस से बचाव' },
        { test: 'मोतियाबिंद, रेटिना और श्रवण (सुनने की) जांच', frequency: 'हर 6–12 महीने में', reason: 'आत्मनिर्भर और सक्रिय जीवनशैली बनाए रखने के लिए' },
        { test: 'फ्लू और निमोनिया टीकाकरण समीक्षा', frequency: 'वर्ष में एक बार', reason: 'फेफड़ों को गंभीर संक्रमण से बचाने के लिए' },
      ],
      mr: [
        { test: 'रक्तदाब, शुगर आणि इलेक्ट्रोलाईट्स तपासणी', frequency: 'मासिक / त्रैमासिक', reason: 'चक्कर येणे, पक्षाघात आणि अशक्तपणा टाळण्यासाठी' },
        { test: 'हाडांची घनता (DEXA) आणि कॅल्शियम चाचणी', frequency: 'दर १–२ वर्षांनी', reason: 'हाडांचे फ्रॅक्चर आणि ठिसूळपणा टाळण्यासाठी' },
        { test: 'मोतीबिंदू, रेटिना आणि श्रवण क्षमता तपासणी', frequency: 'दर ६–१२ महिन्यांनी', reason: 'स्वावलंबी आणि आनंदी जीवनशैलीसाठी' },
        { test: 'इन्फ्लुएंझा आणि न्यूमोनिया लसीकरण आढावा', frequency: 'वर्षातून एकदा', reason: 'फुफ्फुसांचे गंभीर संसर्गापासून रक्षण करण्यासाठी' },
      ],
    },
    dietaryFocus: {
      en: ['Warm, soft, easy-to-digest meals (Khichdi, Dal soup, Ragi)', 'High calcium & protein (Curd, Paneer, Soaked Almonds)', 'Small frequent water sips to prevent silent dehydration'],
      hi: ['गर्म, मुलायम और सुपाच्य भोजन (खिचड़ी, मूंग दाल सूप, रागी)', 'कैल्शियम और प्रोटीन युक्त दही, पनीर और भीगे बादाम', 'निर्जलीकरण से बचने के लिए थोड़ी-थोड़ी देर में पानी पिएं'],
      mr: ['गरम, मऊ आणि पचायला हलका आहार (खिचडी, मुगाचे वरण, नाचणी)', 'कॅल्शियम व प्रथिनांसाठी दही, पनीर आणि भिजवलेले बदाम', 'शरीरात पाण्याची कमतरता टाळण्यासाठी थोड्या-थोड्या वेळाने पाणी प्या'],
    },
    sleepTarget: {
      en: '7 to 8 hours + 20-min early afternoon rest',
      hi: '7 से 8 घंटे + दोपहर में 20 मिनट का हल्का विश्राम',
      mr: '७ ते ८ तास + दुपारी २० मिनिटे वामकुक्षी',
    },
  },
];

export const UI_STRINGS: Record<
  Language,
  {
    appName: string;
    tagline: string;
    navDashboard: string;
    navSymptomAI: string;
    navPreventionLib: string;
    navExercises: string;
    navMeditation: string;
    navHealthChart: string;
    navSleepCheckups: string;
    navTelemedicine: string;
    navEmergencyMap: string;
    navMedicalVault: string;
    seniorModeLabel: string;
    readAloudLabel: string;
    stopReadingLabel: string;
    signInGoogle: string;
    signOut: string;
    welcomeTitle: string;
    welcomeSubtitle: string;
    logVitalsTitle: string;
    medRemindersTitle: string;
    vaccinationsTitle: string;
    encryptedVaultBadge: string;
    emergencyHelpline: string;
  }
> = {
  en: {
    appName: 'Preventia',
    tagline: 'Community Preventive Care & Telemedicine',
    navDashboard: 'Health Tracker',
    navSymptomAI: 'AI Triage & Symptoms',
    navPreventionLib: 'Disease & Diet Library',
    navExercises: 'Exercise & Yoga Guide',
    navMeditation: 'Meditation & Calm Music',
    navHealthChart: 'Blood & Test Normal Chart',
    navSleepCheckups: 'Sleep & Screenings',
    navTelemedicine: 'My Doctors & Appointments',
    navEmergencyMap: 'Nearby Medical Map',
    navMedicalVault: 'Encrypted Records',
    seniorModeLabel: 'Elderly Large-Text',
    readAloudLabel: 'Read Page Aloud',
    stopReadingLabel: 'Stop Voice',
    signInGoogle: 'Sign In with Google',
    signOut: 'Sign Out',
    welcomeTitle: 'Preventive Health & Daily Wellness Dashboard',
    welcomeSubtitle: 'Track vitals, medications, vaccinations, exercises, and age-wise preventive care in English, Hindi, and Marathi.',
    logVitalsTitle: 'Daily Vitals & Sleep Log',
    medRemindersTitle: 'Daily Medication & Wellness Reminders',
    vaccinationsTitle: 'Vaccination & Immunization Schedule',
    encryptedVaultBadge: 'AES-256 Client-Side Encrypted',
    emergencyHelpline: 'Emergency Ambulance: 108 / 112',
  },
  hi: {
    appName: 'प्रिवेंटिया (Preventia)',
    tagline: 'सामुदायिक निवारक स्वास्थ्य और टेलीमेडिसिन',
    navDashboard: 'स्वास्थ्य ट्रैकर',
    navSymptomAI: 'AI लक्षण जांच',
    navPreventionLib: 'रोग और आहार ज्ञान',
    navExercises: 'व्यायाम और योग (उम्र अनुसार)',
    navMeditation: 'ध्यान और शांत संगीत',
    navHealthChart: 'ब्लड व जांच सामान्य चार्ट',
    navSleepCheckups: 'नींद और स्वास्थ्य जांच',
    navTelemedicine: 'डॉक्टर चैट और वीडियो',
    navEmergencyMap: 'नजदीकी अस्पताल मैप',
    navMedicalVault: 'सुरक्षित मेडिकल रिकॉर्ड',
    seniorModeLabel: 'वरिष्ठ नागरिक बड़े अक्षर',
    readAloudLabel: 'महिला आवाज में सुनें',
    stopReadingLabel: 'आवाज रोकें',
    signInGoogle: 'Google से लॉग इन करें',
    signOut: 'लॉग आउट',
    welcomeTitle: 'निवारक स्वास्थ्य और दैनिक कल्याण डैशबोर्ड',
    welcomeSubtitle: 'अपने बीपी, शुगर, दवाइयों, व्यायाम, टीकाकरण और उम्र के अनुसार स्वास्थ्य जांच का पूरा ध्यान रखें।',
    logVitalsTitle: 'दैनिक स्वास्थ्य और नींद लॉग',
    medRemindersTitle: 'दैनंदिन दवाई और स्वास्थ्य अनुस्मारक',
    vaccinationsTitle: 'टीकाकरण (वैक्सीनेशन) तालिका',
    encryptedVaultBadge: 'AES-256 गोपनीयता एन्क्रिप्टेड',
    emergencyHelpline: 'आपातकालीन एम्बुलेंस: 108 / 112',
  },
  mr: {
    appName: 'प्रिव्हेंटिया (Preventia)',
    tagline: 'सामुदायिक प्रतिबंधात्मक आरोग्य आणि टेलीमेडिसिन',
    navDashboard: 'आरोग्य ट्रॅकर',
    navSymptomAI: 'AI लक्षणे तपासणी',
    navPreventionLib: 'आजार आणि आहार माहिती',
    navExercises: 'व्यायाम आणि योग (वयानुसार)',
    navMeditation: 'ध्यान आणि शांत संगीत',
    navHealthChart: 'रक्त व सर्व चाचण्या चार्ट',
    navSleepCheckups: 'झोप आणि आरोग्य चाचण्या',
    navTelemedicine: 'डॉक्टर चॅट आणि व्हिडिओ',
    navEmergencyMap: 'जवळचे रुग्णालय मॅप',
    navMedicalVault: 'सुरक्षित मेडिकल रेकॉर्ड',
    seniorModeLabel: 'ज्येष्ठ नागरिक मोठी अक्षरे',
    readAloudLabel: 'महिला आवाजात ऐका',
    stopReadingLabel: 'आवाज थांबवा',
    signInGoogle: 'Google द्वारे लॉग इन करा',
    signOut: 'लॉग आउट',
    welcomeTitle: 'प्रतिबंधात्मक आरोग्य आणि दैनंदिन आरोग्य डॅशबोर्ड',
    welcomeSubtitle: 'रक्तदाब, शुगर, औषधे, व्यायाम, लसीकरण आणि वयानुसार आरोग्य तपासण्यांचा मराठी, हिंदी व इंग्रजीत मागोवा घ्या.',
    logVitalsTitle: 'दैनंदिन आरोग्य आणि झोपेची नोंद',
    medRemindersTitle: 'दैनंदिन औषधे आणि आरोग्य आठवणी',
    vaccinationsTitle: 'लसीकरण (व्हॅक्सिनेशन) वेळापत्रक',
    encryptedVaultBadge: 'AES-256 गोपनीय एन्क्रिप्टेड',
    emergencyHelpline: 'तातडीची रुग्णवाहिका: १०८ / ११२',
  },
};
