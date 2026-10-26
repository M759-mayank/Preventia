import React, { useState } from 'react';
import { Language } from '../i18n/translations';
import { Activity, AlertTriangle, CheckCircle2, Volume2, Send, Sparkles, ShieldAlert } from 'lucide-react';

interface TriageResponse {
  urgencyLevel: 'Emergency' | 'Urgent' | 'Routine' | 'Self-Care' | string;
  urgencyBadgeText: string;
  summaryAssessment: string;
  recommendedAction: string;
  possibleCauses: string[];
  preventiveCareSteps: string[];
  dietaryAdvice: string;
  redFlags: string[];
}

const QUICK_SYMPTOMS: Record<Language, string[]> = {
  en: [
    'Mild fever (100.5°F), body ache, and fatigue since 2 days',
    'Morning dizziness and headache with high blood pressure history',
    'Knee joint stiffness and pain while walking upstairs',
    'Frequent night urination, excessive thirst, and tiredness',
    'Dry cough, sore throat, and mild seasonal cold',
  ],
  hi: [
    'पिछले 2 दिनों से हल्का बुखार (100.5°F), बदन दर्द और थकान',
    'सुबह उठने पर चक्कर आना और सिर के पिछले हिस्से में दर्द',
    'सीढ़ियां चढ़ते समय घुटनों में जकड़न और दर्द',
    'रात में बार-बार पेशाब आना, अधिक प्यास लगना और कमजोरी',
    'सूखी खांसी, गले में खराश और मौसमी जुकाम',
  ],
  mr: [
    'गेल्या २ दिवसांपासून सौम्य ताप (100.5°F), अंगदुखी आणि थकवा',
    'सकाळी उठल्यावर चक्कर येणे आणि डोक्याच्या मागील बाजूस दुखणे',
    'पायऱ्या चढताना गुडघे आखडणे आणि दुखणे',
    'रात्री वारंवार लघवीला होणे, खूप तहान लागणे आणि अशक्तपणा',
    'कोरडा खोकला, घसा खवखवणे आणि हंगामी सर्दी',
  ],
};

export const SymptomTriageSection: React.FC<{
  language: Language;
  seniorMode: boolean;
  userAge: number;
  onSpeakText: (text: string) => void;
}> = ({ language, seniorMode, userAge, onSpeakText }) => {
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('1-3 days');
  const [severity, setSeverity] = useState('Moderate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TriageResponse | null>(null);

  const copy = {
    en: {
      title: 'AI Symptom Checker & Clinical Triage Assistant',
      subtitle: 'Describe how you feel in English, Hindi, or Marathi. Our AI prioritizes urgent patient needs and offers age-appropriate preventive care.',
      quickLabel: 'One-Tap Common Symptoms (Easy for Seniors):',
      inputPlaceholder: 'Describe symptoms (e.g., headache, fever, knee pain, dizziness)...',
      durationLabel: 'Duration',
      severityLabel: 'Discomfort Level',
      analyzeBtn: 'Run AI Symptom Triage',
      analyzingBtn: 'Analyzing Symptoms...',
      readAloud: 'Listen to Assessment',
      recommendedAction: 'Recommended Next Step',
      possibleCauses: 'Possible Common Causes (Awareness)',
      preventiveSteps: 'Preventive & Home Care Steps',
      dietAdvice: 'Age-Appropriate Recovery Diet',
      redFlags: 'Urgent Warning Signs (Seek Immediate Hospital Care if Present)',
      disclaimer: 'Clinical Notice: Preventia AI Triage provides preventive educational triage and prioritization. For chest pain, severe breathlessness, or stroke signs, dial 108 immediately.',
    },
    hi: {
      title: 'AI लक्षण जांच और प्राथमिक ट्राइएज सहायक',
      subtitle: 'हिंदी, मराठी या अंग्रेजी में अपने लक्षण बताएं। यह प्रणाली तात्कालिकता का आकलन करती है और उम्र के अनुसार बचाव व आहार सुझाव देती है।',
      quickLabel: 'सामान्य लक्षण चुनें (वरिष्ठ नागरिकों के लिए आसान):',
      inputPlaceholder: 'अपने लक्षण यहां लिखें (जैसे: बुखार, चक्कर आना, घुटनों में दर्द)...',
      durationLabel: 'कब से है?',
      severityLabel: 'तीव्रता का स्तर',
      analyzeBtn: 'AI लक्षण जांच शुरू करें',
      analyzingBtn: 'लक्षणों का विश्लेषण हो रहा है...',
      readAloud: 'सुझाव बोलकर सुनें',
      recommendedAction: 'अनुशंसित अगला कदम',
      possibleCauses: 'संभावित सामान्य कारण (जागरूकता)',
      preventiveSteps: 'निवारक और घरेलू देखभाल के उपाय',
      dietAdvice: 'उम्र के अनुसार उपयुक्त आहार',
      redFlags: 'गंभीर चेतावनी संकेत (ये होने पर तुरंत अस्पताल जाएं)',
      disclaimer: 'चिकित्सा सूचना: यह AI मूल्यांकन प्रारंभिक जागरूकता के लिए है। सीने में तेज दर्द या सांस फूलने पर तुरंत 108 पर कॉल करें।',
    },
    mr: {
      title: 'AI लक्षणे तपासणी आणि प्राथमिक ट्रायज सहाय्यक',
      subtitle: 'तुम्हाला काय त्रास होत आहे ते मराठी, हिंदी किंवा इंग्रजीत सांगा. ही प्रणाली तातडीची गरज ओळखून वयानुसार प्रतिबंधात्मक काळजी व आहार सुचवते.',
      quickLabel: 'सामान्य लक्षणे निवडा (ज्येष्ठ नागरिकांसाठी सोपे):',
      inputPlaceholder: 'तुमची लक्षणे येथे लिहा (उदा. ताप, चक्कर येणे, गुडघेदुखी, खोकला)...',
      durationLabel: 'कालावधी',
      severityLabel: 'त्रासाची तीव्रता',
      analyzeBtn: 'AI लक्षणे तपासणी करा',
      analyzingBtn: 'लक्षणांचे विश्लेषण सुरू आहे...',
      readAloud: 'माहिती ऐका',
      recommendedAction: 'पुढील महत्त्वाचे पाऊल',
      possibleCauses: 'संभाव्य सामान्य कारणे (जागरूकता)',
      preventiveSteps: 'प्रतिबंधात्मक आणि घरगुती काळजीचे उपाय',
      dietAdvice: 'वयानुसार योग्य पथ्य आणि आहार',
      redFlags: 'धोक्याची लक्षणे (असल्यास तात्काळ रुग्णालयात जा)',
      disclaimer: 'वैद्यकीय सूचना: ही AI प्रणाली प्राथमिक मार्गदर्शनासाठी आहे. छातीत तीव्र वेदना किंवा धाप लागल्यास तात्काळ १०८ वर कॉल करा.',
    },
  }[language];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptoms.trim(),
          age: userAge,
          duration,
          severity,
          language,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to run triage assessment');
      }
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to reach AI Triage server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-5">
        <div>
          <h2 className={`font-semibold text-slate-900 ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
            {copy.title}
          </h2>
          <p className={`text-slate-600 mt-1 ${seniorMode ? 'text-base' : 'text-sm'}`}>
            {copy.subtitle}
          </p>
        </div>

        {/* One-tap quick symptoms */}
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2.5">{copy.quickLabel}</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_SYMPTOMS[language].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSymptoms(item)}
                className={`text-left px-3.5 py-2 rounded-lg border transition-colors ${
                  symptoms === item
                    ? 'border-teal-700 bg-teal-50 text-teal-950 font-medium'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                } ${seniorMode ? 'text-base' : 'text-xs'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder={copy.inputPlaceholder}
              maxLength={800}
              className={`w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                seniorMode ? 'text-lg' : 'text-sm'
              }`}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                {copy.durationLabel}
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 bg-white"
              >
                <option value="Less than 24 hours">&lt; 24 Hours</option>
                <option value="1-3 days">1 – 3 Days</option>
                <option value="4-7 days">4 – 7 Days</option>
                <option value="More than 1 week">&gt; 1 Week</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                {copy.severityLabel}
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 bg-white"
              >
                <option value="Mild">Mild (सौम्य)</option>
                <option value="Moderate">Moderate (मध्यम)</option>
                <option value="Severe">Severe (तीव्र)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading || !symptoms.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 text-white font-semibold text-sm hover:bg-teal-800 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? copy.analyzingBtn : copy.analyzeBtn}</span>
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Triage Result Report */}
      {result && (
        <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              {result.urgencyLevel === 'Emergency' ? (
                <ShieldAlert className="w-7 h-7 text-red-600 shrink-0" />
              ) : result.urgencyLevel === 'Urgent' ? (
                <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-7 h-7 text-teal-600 shrink-0" />
              )}
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>TRIAGE PRIORITY</span>
                  <span>·</span>
                  <span
                    className={
                      result.urgencyLevel === 'Emergency'
                        ? 'text-red-700 font-bold'
                        : result.urgencyLevel === 'Urgent'
                        ? 'text-amber-700 font-bold'
                        : 'text-teal-700 font-bold'
                    }
                  >
                    {result.urgencyBadgeText || result.urgencyLevel}
                  </span>
                </div>
                <h3 className={`font-semibold text-slate-900 mt-0.5 ${seniorMode ? 'text-xl' : 'text-lg'}`}>
                  {result.recommendedAction}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onSpeakText(
                  `${result.urgencyBadgeText}. ${result.summaryAssessment}. ${result.recommendedAction}. ${result.dietaryAdvice}`
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium hover:bg-slate-100 transition-colors self-start whitespace-nowrap"
            >
              <Volume2 className="w-4 h-4 text-teal-700" />
              <span>{copy.readAloud}</span>
            </button>
          </div>

          <p className={`text-slate-700 leading-relaxed ${seniorMode ? 'text-lg' : 'text-sm'}`}>
            {result.summaryAssessment}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-700" />
                <span>{copy.preventiveSteps}</span>
              </h4>
              <ul className={`space-y-1.5 text-slate-700 list-disc list-inside ${seniorMode ? 'text-base' : 'text-sm'}`}>
                {result.preventiveCareSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Send className="w-4 h-4 text-teal-700" />
                <span>{copy.possibleCauses}</span>
              </h4>
              <ul className={`space-y-1.5 text-slate-700 list-disc list-inside ${seniorMode ? 'text-base' : 'text-sm'}`}>
                {result.possibleCauses.map((cause, idx) => (
                  <li key={idx}>{cause}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-1">
            <h4 className="font-semibold text-teal-950 text-sm">{copy.dietAdvice}</h4>
            <p className={`text-teal-900 ${seniorMode ? 'text-base' : 'text-sm'}`}>
              {result.dietaryAdvice}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 space-y-1.5">
            <h4 className="font-semibold text-red-950 text-sm">{copy.redFlags}</h4>
            <ul className={`space-y-1 text-red-900 list-disc list-inside ${seniorMode ? 'text-base' : 'text-xs'}`}>
              {result.redFlags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">{copy.disclaimer}</p>
        </div>
      )}
    </div>
  );
};
