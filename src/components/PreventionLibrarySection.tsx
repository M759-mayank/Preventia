import React, { useState } from 'react';
import {
  Language,
  DISEASES_LIBRARY,
  AGE_SCREENING_RECOMMENDATIONS,
  EXERCISES_LIBRARY,
  AGE_EXERCISE_PLANS,
} from '../i18n/translations';
import {
  BookOpen,
  ShieldCheck,
  Utensils,
  Moon,
  Stethoscope,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Dumbbell,
  Clock,
  HeartPulse,
  Sparkles,
} from 'lucide-react';

export const PreventionLibrarySection: React.FC<{
  language: Language;
  seniorMode: boolean;
  mode: 'library' | 'exercises' | 'sleep_screenings';
  userAge: number;
  onSpeakText: (text: string) => void;
  onSwitchMode?: (newMode: 'library' | 'exercises' | 'sleep_screenings') => void;
}> = ({ language, seniorMode, mode, userAge, onSpeakText, onSwitchMode }) => {
  const [selectedDiseaseId, setSelectedDiseaseId] = useState(DISEASES_LIBRARY[0].id);
  const [selectedExerciseId, setSelectedExerciseId] = useState(EXERCISES_LIBRARY[0].id);

  const defaultAgeGroup =
    userAge < 19
      ? 'youth'
      : userAge < 40
      ? 'young_adult'
      : userAge < 60
      ? 'middle_age'
      : 'seniors';
  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState(defaultAgeGroup);

  const selectedDisease =
    DISEASES_LIBRARY.find((d) => d.id === selectedDiseaseId) || DISEASES_LIBRARY[0];
  const selectedExercise =
    EXERCISES_LIBRARY.find((e) => e.id === selectedExerciseId) || EXERCISES_LIBRARY[0];
  const selectedAgeGroup =
    AGE_SCREENING_RECOMMENDATIONS.find((a) => a.ageGroupId === selectedAgeGroupId) ||
    AGE_SCREENING_RECOMMENDATIONS[3];
  const selectedExerciseAgePlan =
    AGE_EXERCISE_PLANS.find((a) => a.ageGroupId === selectedAgeGroupId) ||
    AGE_EXERCISE_PLANS[3];

  const copy = {
    en: {
      libTitle: 'Preventive Care, Symptoms & Age-Wise Diet Library',
      libSubtitle:
        'Evidence-based disease awareness, early warning symptoms, preventive steps, and nutrition tailored by age group.',
      symptomsHeading: 'Early Symptoms & Warning Signs',
      preventionHeading: 'Daily Preventive Care Protocol',
      dietHeading: 'Age-Specific Dietary Recommendations',
      childrenLabel: 'Children & Teens (0–18 Yrs)',
      adultsLabel: 'Adults (19–59 Yrs)',
      seniorsLabel: 'Senior Citizens (60+ Yrs)',
      listenBtn: 'Listen in Female Voice',
      switchToExercises: 'Open Exercise & Yoga Library →',
      switchToDiseases: '← Back to Disease & Diet Library',
      exTitle: 'Exercise, Yoga & Age-Wise Physical Activity Library',
      exSubtitle:
        'Step-by-step physical exercises, Chair Yoga for seniors, Pranayama, and age-specific daily movement schedules.',
      exStepsHeading: 'How to Perform Safely (Step-by-Step)',
      exBenefitsHeading: 'Clinical & Preventive Health Benefits',
      exPrecautionsHeading: 'Safety Precautions & Doctor Advice',
      exAgeRecHeading: 'Age-Wise Exercise Adaptation',
      exAgeMatrixTitle: 'Age-Wise Daily Exercise & Movement Schedule',
      exSelectAgePrompt: 'Select Age Group for Personalized Exercise Plan:',
      exActivityCol: 'Recommended Exercise / Activity',
      exDurationCol: 'Daily / Weekly Duration',
      exFocusCol: 'Health & Preventive Benefit',
      exSafetyHeading: 'Essential Exercise Safety Rules for This Age Group',
      sleepTitle: 'Restorative Sleep Hygiene & Age-Wise Health Screenings',
      sleepSubtitle:
        'Regular preventive screenings and restorative sleep habits tailored to your life stage.',
      selectAgePrompt: 'Select Age Bracket for Recommended Checkups:',
      recommendedTests: 'Recommended Preventive Screenings & Checkups',
      frequencyCol: 'Schedule Frequency',
      purposeCol: 'Clinical Preventive Purpose',
      sleepHygieneHeading: 'Dedicated Sleep & Circadian Wellness Protocol',
      sleepRules: [
        'Keep a fixed sleep and wake-up time every day (e.g., 10:00 PM to 6:00 AM) to stabilize blood pressure and cortisol.',
        'Finish dinner at least 2 hours before bedtime; prefer warm light meals like khichdi, dal-roti, or vegetable soup.',
        'For elderly patients: keep a warm low-glare night lamp along the bedroom-to-bathroom path to prevent night falls.',
        'Avoid tea, coffee, and mobile screen light for 60 minutes before sleeping.',
      ],
    },
    hi: {
      libTitle: 'रोग निवारण, लक्षण और उम्र के अनुसार आहार पुस्तकालय',
      libSubtitle:
        'प्रमुख बीमारियों के शुरुआती लक्षण, बचाव के उपाय और बच्चों, वयस्कों व बुजुर्गों के लिए उचित आहार।',
      symptomsHeading: 'प्रारंभिक लक्षण और संकेत',
      preventionHeading: 'दैनिक बचाव और निवारक उपाय',
      dietHeading: 'उम्र के अनुसार उचित आहार (Diet by Age)',
      childrenLabel: 'बच्चे और किशोर (0–18 वर्ष)',
      adultsLabel: 'वयस्क (19–59 वर्ष)',
      seniorsLabel: 'वरिष्ठ नागरिक (60+ वर्ष)',
      listenBtn: 'महिला आवाज में सुनें',
      switchToExercises: 'व्यायाम और योग पुस्तकालय खोलें →',
      switchToDiseases: '← रोग और आहार पुस्तकालय पर जाएं',
      exTitle: 'व्यायाम, योग और उम्र के अनुसार शारीरिक कसरत पुस्तकालय',
      exSubtitle:
        'वरिष्ठ नागरिकों के लिए सुरक्षित चेयर योग, शतपावली, प्राणायाम और प्रत्येक आयु वर्ग के लिए दैनिक व्यायाम तालिका।',
      exStepsHeading: 'व्यायाम करने की सही विधि (Step-by-Step)',
      exBenefitsHeading: 'स्वास्थ्य लाभ और रोग निवारण',
      exPrecautionsHeading: 'महत्वपूर्ण सावधानियां और सुरक्षा नियम',
      exAgeRecHeading: 'उम्र के अनुसार व्यायाम की सलाह (Age-Wise Guide)',
      exAgeMatrixTitle: 'उम्र के अनुसार दैनिक और साप्ताहिक व्यायाम तालिका',
      exSelectAgePrompt: 'अपनी उम्र के अनुसार व्यायाम योजना देखने के लिए आयु वर्ग चुनें:',
      exActivityCol: 'अनुशंसित व्यायाम / योग',
      exDurationCol: 'समय और अवधि',
      exFocusCol: 'मुख्य स्वास्थ्य लाभ',
      exSafetyHeading: 'इस आयु वर्ग के लिए व्यायाम सुरक्षा नियम',
      sleepTitle: 'उचित नींद (Sleep Care) और उम्र के अनुसार स्वास्थ्य जांच',
      sleepSubtitle:
        'आपकी आयु के अनुसार आवश्यक नियमित मेडिकल जांच और गहरी नींद के नियम।',
      selectAgePrompt: 'स्वास्थ्य जांच देखने के लिए आयु वर्ग चुनें:',
      recommendedTests: 'अनुशंसित नियमित स्वास्थ्य जांच (Screenings)',
      frequencyCol: 'कब करवाएं',
      purposeCol: 'स्वास्थ्य लाभ और उद्देश्य',
      sleepHygieneHeading: 'बेहतर और गहरी नींद के लिए दैनिक नियम',
      sleepRules: [
        'प्रतिदिन सोने और उठने का समय निश्चित रखें (जैसे रात 10:00 से सुबह 6:00 बजे), इससे बीपी और शुगर नियंत्रित रहते हैं।',
        'सोने से कम से कम 2 घंटे पहले हल्का और सुपाच्य रात्रि भोजन करें।',
        'बुजुर्गों के लिए: रात में गिरने से बचने के लिए कमरे से बाथरूम के रास्ते में हल्की रोशनी (नाइट लैंप) अवश्य रखें।',
        'सोने से 1 घंटे पहले चाय, कॉफी और मोबाइल स्क्रीन का प्रयोग बंद कर दें।',
      ],
    },
    mr: {
      libTitle: 'आजार प्रतिबंध, लक्षणे आणि वयानुसार आहार माहितीकोश',
      libSubtitle:
        'सामान्य आजारांची लक्षणे, प्रतिबंधात्मक उपाय आणि लहान मुले, तरुण व ज्येष्ठ नागरिकांसाठी योग्य आहार.',
      symptomsHeading: 'प्राथमिक लक्षणे आणि इशारे',
      preventionHeading: 'दैनंदिन प्रतिबंधात्मक काळजी (Prevention)',
      dietHeading: 'वयोगटानुसार योग्य आहार (Age-Wise Diet)',
      childrenLabel: 'लहान मुले व किशोरवयीन (०–१८ वर्षे)',
      adultsLabel: 'प्रौढ वयोगट (१९–५९ वर्षे)',
      seniorsLabel: 'ज्येष्ठ नागरिक (६०+ वर्षे)',
      listenBtn: 'महिला आवाजात ऐका',
      switchToExercises: 'व्यायाम आणि योग माहितीकोश पहा →',
      switchToDiseases: '← आजार आणि आहार माहितीकोशाकडे परत जा',
      exTitle: 'व्यायाम, योगासने आणि वयोमानानुसार शारीरिक तंदुरुस्ती माहितीकोश',
      exSubtitle:
        'ज्येष्ठ नागरिकांसाठी सुरक्षित खुर्चीवरील योग (Chair Yoga), शतपावली, प्राणायाम आणि प्रत्येक वयोगटासाठी दैनंदिन व्यायामाचे वेळापत्रक.',
      exStepsHeading: 'व्यायाम करण्याची योग्य पद्धत (Step-by-Step कृती)',
      exBenefitsHeading: 'वैद्यकीय आणि आरोग्यदायी फायदे',
      exPrecautionsHeading: 'महत्त्वाची काळजी आणि दक्षता',
      exAgeRecHeading: 'वयोगटानुसार व्यायामाची शिफारस (Age-Wise Exercise)',
      exAgeMatrixTitle: 'वयोगटानुसार दैनंदिन आणि साप्ताहिक व्यायाम वेळापत्रक',
      exSelectAgePrompt: 'तुमच्या वयानुसार व्यायाम आराखडा पाहण्यासाठी वयोगट निवडा:',
      exActivityCol: 'शिफारस केलेला व्यायाम / योग प्रकार',
      exDurationCol: 'वेळ आणि कालावधी',
      exFocusCol: 'मुख्य आरोग्य फायदा',
      exSafetyHeading: 'या वयोगटासाठी व्यायामाचे सुरक्षितता नियम',
      sleepTitle: 'शांत झोप (Sleep Care) आणि वयानुसार नियमित आरोग्य तपासण्या',
      sleepSubtitle:
        'तुमच्या वयोगटानुसार आवश्यक नियमित वैद्यकीय चाचण्या आणि शांत झोपेसाठी आरोग्यदायी सवयी.',
      selectAgePrompt: 'आरोग्य तपासण्या पाहण्यासाठी वयोगट निवडा:',
      recommendedTests: 'शिफारस केलेल्या नियमित आरोग्य तपासण्या (Screenings)',
      frequencyCol: 'कधी करावी',
      purposeCol: 'वैद्यकीय उद्देश व महत्त्व',
      sleepHygieneHeading: 'उत्तम आणि शांत झोपेसाठी महत्त्वाचे नियम',
      sleepRules: [
        'दररोज झोपण्याची आणि उठण्याची वेळ निश्चित ठेवा (उदा. रात्री १० ते सकाळी ६), यामुळे रक्तदाब व शुगर नियंत्रणात राहते.',
        'झोपण्यापूर्वी किमान २ तास आधी पचायला हलके जेवण घ्या.',
        'ज्येष्ठ नागरिकांसाठी: रात्री उठताना पडू नये म्हणून बेडरूम ते बाथरूमच्या मार्गावर मंद नाईट लॅम्प चालू ठेवा.',
        'झोपण्यापूर्वी १ तास चहा, कॉफी आणि मोबाईल स्क्रीन पाहणे टाळा.',
      ],
    },
  }[language];

  // MODE 1: DISEASE, SYMPTOMS & AGE-WISE DIET LIBRARY
  if (mode === 'library') {
    return (
      <div className="space-y-6">
        <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className={`font-semibold text-slate-900 ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
                {copy.libTitle}
              </h2>
              <p className={`text-slate-600 mt-1 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                {copy.libSubtitle}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 self-start">
              {onSwitchMode && (
                <button
                  type="button"
                  onClick={() => onSwitchMode('exercises')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-teal-700 bg-teal-50 text-teal-900 text-xs font-semibold hover:bg-teal-100 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Dumbbell className="w-4 h-4 text-teal-700" />
                  <span>{copy.switchToExercises}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  onSpeakText(
                    `${selectedDisease.name[language]}. ${selectedDisease.overview[language]}. ${selectedDisease.symptoms[
                      language
                    ].join('. ')}. ${selectedDisease.prevention[language].join(
                      '. '
                    )}. ${selectedDisease.dietByAge.seniors[language]}`
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>{copy.listenBtn}</span>
              </button>
            </div>
          </div>

          {/* Disease Selector Tabs */}
          <div className="flex flex-wrap gap-2 pt-2">
            {DISEASES_LIBRARY.map((dis) => (
              <button
                key={dis.id}
                type="button"
                onClick={() => setSelectedDiseaseId(dis.id)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                  selectedDiseaseId === dis.id
                    ? 'border-teal-700 bg-teal-700 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {dis.name[language]}
              </button>
            ))}
          </div>
        </div>

        {/* Disease Detail Panel */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs text-teal-700 font-medium">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{selectedDisease.category[language]}</span>
            </div>
            <h3 className={`font-semibold text-slate-900 mt-1 ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
              {selectedDisease.name[language]}
            </h3>
            <p className={`text-slate-600 mt-2 leading-relaxed ${seniorMode ? 'text-lg' : 'text-sm'}`}>
              {selectedDisease.overview[language]}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Symptoms */}
            <div className="p-5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
              <h4 className="font-semibold text-amber-950 text-base flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>{copy.symptomsHeading}</span>
              </h4>
              <ul className={`space-y-2 text-slate-800 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                {selectedDisease.symptoms[language].map((sym, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-700 font-bold">•</span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prevention */}
            <div className="p-5 rounded-xl bg-teal-50/50 border border-teal-200 space-y-3">
              <h4 className="font-semibold text-teal-950 text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>{copy.preventionHeading}</span>
              </h4>
              <ul className={`space-y-2 text-slate-800 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                {selectedDisease.prevention[language].map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Age-Wise Diet Matrix */}
          <div className="pt-2 space-y-3">
            <h4 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <Utensils className="w-4 h-4 text-teal-700" />
              <span>{copy.dietHeading}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                <p className="text-xs font-semibold text-teal-800">{copy.childrenLabel}</p>
                <p className={`text-slate-700 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                  {selectedDisease.dietByAge.children[language]}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                <p className="text-xs font-semibold text-teal-800">{copy.adultsLabel}</p>
                <p className={`text-slate-700 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                  {selectedDisease.dietByAge.adults[language]}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-1.5">
                <p className="text-xs font-semibold text-teal-900">{copy.seniorsLabel}</p>
                <p className={`text-slate-800 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                  {selectedDisease.dietByAge.seniors[language]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MODE 2: DEDICATED EXERCISES, YOGA & AGE-WISE RECOMMENDATIONS SECTION
  if (mode === 'exercises') {
    return (
      <div className="space-y-6">
        {/* Header + Listen in Female Voice Button */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className={`font-semibold text-slate-900 ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
                {copy.exTitle}
              </h2>
              <p className={`text-slate-600 mt-1 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                {copy.exSubtitle}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 self-start">
              {onSwitchMode && (
                <button
                  type="button"
                  onClick={() => onSwitchMode('library')}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>{copy.switchToDiseases}</span>
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  onSpeakText(
                    `${selectedExercise.name[language]}. ${selectedExercise.overview[language]}. ${selectedExercise.steps[
                      language
                    ].join('. ')}. ${selectedExercise.benefits[language].join(
                      '. '
                    )}. ${selectedExercise.ageRecommendations.seniors[language]}`
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>{copy.listenBtn}</span>
              </button>
            </div>
          </div>

          {/* Exercise Selector Tabs */}
          <div className="flex flex-wrap gap-2 pt-2">
            {EXERCISES_LIBRARY.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => setSelectedExerciseId(ex.id)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                  selectedExerciseId === ex.id
                    ? 'border-teal-700 bg-teal-700 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {ex.name[language]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Exercise Detailed Guide */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6">
          <div className="pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-teal-700 font-medium">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>{selectedExercise.category[language]}</span>
              </div>
              <h3 className={`font-semibold text-slate-900 mt-1 ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
                {selectedExercise.name[language]}
              </h3>
              <p className={`text-slate-600 mt-2 leading-relaxed ${seniorMode ? 'text-lg' : 'text-sm'}`}>
                {selectedExercise.overview[language]}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <div className="px-3.5 py-2 rounded-lg bg-teal-50 border border-teal-200 text-xs font-semibold text-teal-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-700" />
                <span>{selectedExercise.duration[language]}</span>
              </div>
              <div className="px-3.5 py-2 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-teal-700" />
                <span>{selectedExercise.intensity[language]}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step-by-Step Instructions */}
            <div className="p-5 rounded-xl bg-teal-50/50 border border-teal-200 space-y-3">
              <h4 className="font-semibold text-teal-950 text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>{copy.exStepsHeading}</span>
              </h4>
              <ol className={`space-y-2.5 text-slate-800 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                {selectedExercise.steps[language].map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="font-mono text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Health Benefits & Precautions */}
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                <h4 className="font-semibold text-emerald-950 text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>{copy.exBenefitsHeading}</span>
                </h4>
                <ul className={`space-y-2 text-slate-800 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                  {selectedExercise.benefits[language].map((ben, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                <h4 className="font-semibold text-amber-950 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>{copy.exPrecautionsHeading}</span>
                </h4>
                <ul className={`space-y-1.5 text-slate-800 ${seniorMode ? 'text-base' : 'text-xs'}`}>
                  {selectedExercise.precautions[language].map((pre, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">•</span>
                      <span>{pre}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Age-Specific Exercise Adaptation Cards */}
          <div className="pt-2 space-y-3">
            <h4 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-teal-700" />
              <span>{copy.exAgeRecHeading}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                <p className="text-xs font-semibold text-teal-800">{copy.childrenLabel}</p>
                <p className={`text-slate-700 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                  {selectedExercise.ageRecommendations.children[language]}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                <p className="text-xs font-semibold text-teal-800">{copy.adultsLabel}</p>
                <p className={`text-slate-700 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                  {selectedExercise.ageRecommendations.adults[language]}
                </p>
              </div>
              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-1.5">
                <p className="text-xs font-semibold text-teal-900">{copy.seniorsLabel}</p>
                <p className={`text-slate-800 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                  {selectedExercise.ageRecommendations.seniors[language]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Age-Wise Complete Exercise Schedule Matrix */}
        <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className={`font-semibold text-slate-900 ${seniorMode ? 'text-xl' : 'text-lg'}`}>
                {copy.exAgeMatrixTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{copy.exSelectAgePrompt}</p>
            </div>
            <button
              type="button"
              onClick={() =>
                onSpeakText(
                  `${selectedExerciseAgePlan.label[language]}. ${
                    selectedExerciseAgePlan.dailyTarget[language]
                  }. ${selectedExerciseAgePlan.weeklySchedule[language]
                    .map((s) => `${s.activity}, ${s.duration}, ${s.focus}`)
                    .join('. ')}`
                )
              }
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-teal-700 text-teal-800 text-xs font-semibold hover:bg-teal-50 transition-colors self-start whitespace-nowrap cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{copy.listenBtn}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {AGE_EXERCISE_PLANS.map((grp) => (
              <button
                key={grp.ageGroupId}
                type="button"
                onClick={() => setSelectedAgeGroupId(grp.ageGroupId)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                  selectedAgeGroupId === grp.ageGroupId
                    ? 'border-teal-700 bg-teal-700 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {grp.label[language]}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-teal-950">
              {selectedExerciseAgePlan.label[language]} — {selectedExerciseAgePlan.dailyTarget[language]}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                  <th className="py-3 pr-4">{copy.exActivityCol}</th>
                  <th className="py-3 px-4">{copy.exDurationCol}</th>
                  <th className="py-3 pl-4">{copy.exFocusCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedExerciseAgePlan.weeklySchedule[language].map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className={`py-3.5 pr-4 font-semibold text-slate-900 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                      {item.activity}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-teal-800 tabular-nums whitespace-nowrap">
                      {item.duration}
                    </td>
                    <td className={`py-3.5 pl-4 text-slate-600 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                      {item.focus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-semibold text-slate-700">{copy.exSafetyHeading}:</h4>
            <div className="flex flex-wrap gap-4">
              {selectedExerciseAgePlan.safetyTips[language].map((tip, idx) => (
                <span
                  key={idx}
                  className={`text-slate-800 flex items-center gap-1.5 ${seniorMode ? 'text-base' : 'text-xs'}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span>{tip}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MODE 3: SLEEP & AGE-WISE HEALTH SCREENINGS MODE
  return (
    <div className="space-y-6">
      <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className={`font-semibold text-slate-900 ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
              {copy.sleepTitle}
            </h2>
            <p className={`text-slate-600 mt-1 ${seniorMode ? 'text-base' : 'text-sm'}`}>
              {copy.sleepSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onSpeakText(
                `${copy.sleepTitle}. ${selectedAgeGroup.label[language]}. ${copy.sleepRules.join('. ')}`
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors self-start whitespace-nowrap cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>{copy.listenBtn}</span>
          </button>
        </div>

        <div className="pt-2">
          <p className="text-xs font-medium text-slate-500 mb-2">{copy.selectAgePrompt}</p>
          <div className="flex flex-wrap gap-2">
            {AGE_SCREENING_RECOMMENDATIONS.map((grp) => (
              <button
                key={grp.ageGroupId}
                type="button"
                onClick={() => setSelectedAgeGroupId(grp.ageGroupId)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap cursor-pointer ${
                  selectedAgeGroupId === grp.ageGroupId
                    ? 'border-teal-700 bg-teal-700 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {grp.label[language]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Age-Specific Screenings Table */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-700" />
            <span>
              {copy.recommendedTests} — {selectedAgeGroup.label[language]}
            </span>
          </h3>
          <span className="text-xs text-teal-800 font-medium">
            Target Sleep: {selectedAgeGroup.sleepTarget[language]}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                <th className="py-3 pr-4">Screening Test</th>
                <th className="py-3 px-4">{copy.frequencyCol}</th>
                <th className="py-3 pl-4">{copy.purposeCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedAgeGroup.screenings[language].map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className={`py-3.5 pr-4 font-semibold text-slate-900 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                    {item.test}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-teal-800 tabular-nums whitespace-nowrap">
                    {item.frequency}
                  </td>
                  <td className={`py-3.5 pl-4 text-slate-600 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                    {item.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Age-Bracket Nutrition Highlights */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 mt-4">
          <h4 className="text-xs font-semibold text-slate-700">
            Daily Nutrition Focus ({selectedAgeGroup.label[language]}):
          </h4>
          <div className="flex flex-wrap gap-3">
            {selectedAgeGroup.dietaryFocus[language].map((d, i) => (
              <span key={i} className={`text-slate-800 flex items-center gap-1.5 ${seniorMode ? 'text-base' : 'text-xs'}`}>
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <span>{d}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Dedicated Restorative Sleep Section */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <Moon className="w-5 h-5 text-teal-700" />
          <h3 className={`font-semibold text-slate-900 ${seniorMode ? 'text-xl' : 'text-lg'}`}>
            {copy.sleepHygieneHeading}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {copy.sleepRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3"
            >
              <span className="font-mono text-xs font-semibold text-teal-700 tabular-nums mt-0.5">
                0{idx + 1}.
              </span>
              <p className={`text-slate-700 leading-relaxed ${seniorMode ? 'text-base' : 'text-sm'}`}>
                {rule}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
