import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Volume2,
  Droplets,
  HeartPulse,
  Activity,
  Calculator,
  Sparkles,
  Filter,
  Info,
  Clock,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Language } from '../i18n/translations';
import {
  LAB_TEST_REFERENCES,
  TEST_CATEGORIES,
  TestCategoryId,
  LabTestReferenceItem,
} from '../data/healthChartTestsData';

interface HealthNormalRangesChartSectionProps {
  language: Language;
  seniorMode: boolean;
  userAge: number;
  onSpeakText: (text: string) => void;
}

export const HealthNormalRangesChartSection: React.FC<
  HealthNormalRangesChartSectionProps
> = ({ language, seniorMode, userAge, onSpeakText }) => {
  const [selectedCategory, setSelectedCategory] = useState<TestCategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fastingFilter, setFastingFilter] = useState<'all' | 'fasting' | 'non_fasting'>('all');

  // Interactive Lab Value Checker State
  const [selectedTestId, setSelectedTestId] = useState<string>('fbs');
  const [inputValue, setInputValue] = useState<string>('94');

  const selectedTestObj: LabTestReferenceItem = useMemo(() => {
    return (
      LAB_TEST_REFERENCES.find((item) => item.id === selectedTestId) ||
      LAB_TEST_REFERENCES[0]
    );
  }, [selectedTestId]);

  const numericInput = parseFloat(inputValue);

  const evaluationResult = useMemo(() => {
    if (Number.isNaN(numericInput)) return null;
    const t = selectedTestObj;

    if (numericInput >= t.normalMin && numericInput <= t.normalMax) {
      return {
        status: 'normal' as const,
        badge:
          language === 'mr'
            ? 'सामान्य श्रेणीत (Normal Range)'
            : language === 'hi'
            ? 'सामान्य सीमा में (Normal Range)'
            : 'Within Normal Range',
        explanation:
          language === 'mr'
            ? `तुमचे ${t.name.mr} मूल्य (${numericInput} ${t.unit}) सामान्य वैद्यकीय मर्यादेत (${t.normalMin}–${t.normalMax} ${t.unit}) आहे.`
            : language === 'hi'
            ? `आपका ${t.name.hi} मान (${numericInput} ${t.unit}) सामान्य चिकित्सा सीमा (${t.normalMin}–${t.normalMax} ${t.unit}) के भीतर है।`
            : `Your ${t.name.en} reading (${numericInput} ${t.unit}) is within the standard normal reference interval (${t.normalMin}–${t.normalMax} ${t.unit}).`,
      };
    }

    const isBorderlineLow =
      t.borderlineLow !== undefined &&
      numericInput < t.normalMin &&
      numericInput >= t.borderlineLow;
    const isBorderlineHigh =
      t.borderlineHigh !== undefined &&
      numericInput > t.normalMax &&
      numericInput <= t.borderlineHigh;

    if (isBorderlineLow || isBorderlineHigh) {
      return {
        status: 'borderline' as const,
        badge:
          language === 'mr'
            ? 'सीमारेषेवर / बॉर्डरलाईन (Borderline)'
            : language === 'hi'
            ? 'बॉर्डरलाइन / सावधानी (Borderline)'
            : 'Borderline — Monitor Closely',
        explanation:
          language === 'mr'
            ? `तुमचे ${t.name.mr} मूल्य (${numericInput} ${t.unit}) बॉर्डरलाईन श्रेणीत आहे. सामान्य श्रेणी: ${t.normalRangeText.mr}.`
            : language === 'hi'
            ? `आपका ${t.name.hi} मान (${numericInput} ${t.unit}) बॉर्डरलाइन श्रेणी में है। सामान्य सीमा: ${t.normalRangeText.hi}।`
            : `Your ${t.name.en} reading (${numericInput} ${t.unit}) is in the borderline zone. Normal target: ${t.normalRangeText.en}.`,
      };
    }

    const direction = numericInput < t.normalMin ? 'Low' : 'High';
    return {
      status: 'abnormal' as const,
      badge:
        language === 'mr'
          ? direction === 'Low'
            ? 'सामान्यापेक्षा कमी (Low Alert)'
            : 'सामान्यापेक्षा जास्त (High Alert)'
          : language === 'hi'
          ? direction === 'Low'
            ? 'सामान्य से कम (Low Alert)'
            : 'सामान्य से अधिक (High Alert)'
          : `${direction} — Outside Normal Range`,
      explanation:
        language === 'mr'
          ? `तुमचे ${t.name.mr} मूल्य (${numericInput} ${t.unit}) सामान्य मर्यादेबाहेर (${t.normalMin}–${t.normalMax} ${t.unit}) आहे. कृपया डॉक्टरांचा सल्ला घ्या.`
          : language === 'hi'
          ? `आपका ${t.name.hi} मान (${numericInput} ${t.unit}) सामान्य सीमा (${t.normalMin}–${t.normalMax} ${t.unit}) से बाहर है। कृपया डॉक्टर से परामर्श लें।`
          : `Your ${t.name.en} reading (${numericInput} ${t.unit}) is outside the normal range (${t.normalMin}–${t.normalMax} ${t.unit}). Please consult your doctor.`,
    };
  }, [numericInput, selectedTestObj, language]);

  const filteredTests = useMemo(() => {
    return LAB_TEST_REFERENCES.filter((test) => {
      if (selectedCategory !== 'all' && test.category !== selectedCategory) {
        return false;
      }
      if (fastingFilter === 'fasting' && !test.fastingRequired) {
        return false;
      }
      if (fastingFilter === 'non_fasting' && test.fastingRequired) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName =
          test.name.en.toLowerCase().includes(q) ||
          test.name.hi.toLowerCase().includes(q) ||
          test.name.mr.toLowerCase().includes(q) ||
          test.shortCode.toLowerCase().includes(q) ||
          test.whatItMeasures[language].toLowerCase().includes(q);
        if (!matchesName) return false;
      }
      return true;
    });
  }, [selectedCategory, fastingFilter, searchQuery, language]);

  // Visual chart data for key everyday blood & vital parameters (mg/dL & mmHg scale)
  const chartData = useMemo(
    () => [
      {
        parameter: language === 'mr' ? 'फास्टिंग शुगर' : language === 'hi' ? 'फास्टिंग शुगर' : 'Fasting Sugar',
        minNormal: 70,
        maxNormal: 99,
        alertThreshold: 126,
        unit: 'mg/dL',
      },
      {
        parameter: language === 'mr' ? 'जेवणानंतर शुगर' : language === 'hi' ? 'भोजन बाद शुगर' : 'Post-Meal Sugar',
        minNormal: 80,
        maxNormal: 140,
        alertThreshold: 200,
        unit: 'mg/dL',
      },
      {
        parameter: language === 'mr' ? 'सिस्टोलिक बीपी' : language === 'hi' ? 'सिस्टोलिक बीपी' : 'Systolic BP',
        minNormal: 90,
        maxNormal: 120,
        alertThreshold: 140,
        unit: 'mmHg',
      },
      {
        parameter: language === 'mr' ? 'डायस्टोलिक बीपी' : language === 'hi' ? 'डायस्टोलिक बीपी' : 'Diastolic BP',
        minNormal: 60,
        maxNormal: 80,
        alertThreshold: 90,
        unit: 'mmHg',
      },
      {
        parameter: language === 'mr' ? 'एकूण कोलेस्ट्रॉल' : language === 'hi' ? 'कुल कोलेस्ट्रॉल' : 'Total Chol.',
        minNormal: 120,
        maxNormal: 199,
        alertThreshold: 240,
        unit: 'mg/dL',
      },
      {
        parameter: language === 'mr' ? 'LDL कोलेस्ट्रॉल' : language === 'hi' ? 'LDL कोलेस्ट्रॉल' : 'LDL (Bad) Chol.',
        minNormal: 50,
        maxNormal: 99,
        alertThreshold: 160,
        unit: 'mg/dL',
      },
      {
        parameter: language === 'mr' ? 'ट्रायग्लिसराइड्स' : language === 'hi' ? 'ट्राइग्लिसराइड्स' : 'Triglycerides',
        minNormal: 50,
        maxNormal: 149,
        alertThreshold: 200,
        unit: 'mg/dL',
      },
      {
        parameter: language === 'mr' ? 'सोडियम (Na+)' : language === 'hi' ? 'सोडियम (Na+)' : 'Sodium (Na+)',
        minNormal: 135,
        maxNormal: 145,
        alertThreshold: 150,
        unit: 'mEq/L',
      },
    ],
    [language]
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white rounded-2xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-semibold">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>
              {language === 'mr'
                ? 'संपूर्ण रक्त आणि निदान चाचण्यांचा सामान्य श्रेणी तक्ता (ICMR / WHO मानके)'
                : language === 'hi'
                ? 'संपूर्ण रक्त और स्वास्थ्य जांच की सामान्य सीमा चार्ट (ICMR / WHO मानक)'
                : 'Complete Blood Test & Clinical Diagnostic Normal Ranges Chart'}
            </span>
          </div>
          <h2 className={`font-display font-bold ${seniorMode ? 'text-3xl' : 'text-2xl'}`}>
            {language === 'mr'
              ? 'रक्त चाचण्या आणि सर्व वैद्यकीय तपासण्यांचे सामान्य प्रमाण (Health Chart)'
              : language === 'hi'
              ? 'ब्लड टेस्ट और सभी स्वास्थ्य जांचों का सामान्य रेंज चार्ट (Health Chart)'
              : 'Blood Tests & Complete Diagnostic Normal Ranges Health Chart'}
          </h2>
          <p className={`text-teal-100 max-w-3xl ${seniorMode ? 'text-base' : 'text-sm'}`}>
            {language === 'mr'
              ? 'सीबीसी (CBC), शुगर, लिपिड प्रोफाइल (कोलेस्ट्रॉल), किडनी (KFT), लिव्हर (LFT), थायरॉइड, व्हिटॅमिन D/B12, बीपी, ईसीजी, लघवी, हाडांची घनता (DEXA) आणि डोळ्यांच्या चाचण्यांचे सामान्य, बॉर्डरलाईन आणि धोक्याचे प्रमाण तपासा.'
              : language === 'hi'
              ? 'CBC, ब्लड शुगर, कोलेस्ट्रॉल (लिपिड प्रोफाइल), किडनी (KFT), लिवर (LFT), थायरॉइड, विटामिन D/B12, बीपी, ECG, यूरिन, बोन डेंसिटी (DEXA) और नेत्र जांच की सामान्य और बॉर्डरलाइन रेंज आसानी से समझें।'
              : 'Verify normal, borderline, and alert reference ranges across Complete Blood Count (CBC), Blood Sugar, Lipid Profile, Kidney (KFT), Liver (LFT), Thyroid, Vitamins, Cardiac/Lung Vitals, Urine, Bone Density, and Eye screenings.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onSpeakText(
              language === 'mr'
                ? 'रक्त चाचण्या आणि सर्व वैद्यकीय तपासण्यांचा सामान्य श्रेणी तक्ता. येथे तुम्ही सीबीसी, शुगर, कोलेस्ट्रॉल, किडनी, लिव्हर, थायरॉइड आणि इतर सर्व चाचण्यांचे सामान्य प्रमाण तपासू शकता.'
                : language === 'hi'
                ? 'ब्लड टेस्ट और सभी स्वास्थ्य जांचों का सामान्य रेंज चार्ट। यहां आप सीबीसी, शुगर, कोलेस्ट्रॉल, किडनी, लिवर और थायरॉइड की सामान्य सीमा देख सकते हैं।'
                : 'Blood Tests and Complete Diagnostic Normal Ranges Health Chart. Check normal, borderline, and alert ranges for blood tests, organ function, vitamins, and clinical screenings.'
            )
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-teal-950 font-semibold text-xs hover:bg-teal-50 transition-colors shrink-0 cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-teal-700" />
          <span>
            {language === 'mr'
              ? 'तक्त्याची माहिती ऐका'
              : language === 'hi'
              ? 'चार्ट की जानकारी सुनें'
              : 'Listen to Chart Guide'}
          </span>
        </button>
      </div>

      {/* Interactive Lab Report Value Checker + Visual Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Lab Value Analyzer (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-white border border-slate-200 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <Calculator className="w-4 h-4 text-teal-700" />
              <span>
                {language === 'mr'
                  ? 'तुमचा लॅब रिपोर्ट क्रमांक तपासा'
                  : language === 'hi'
                  ? 'अपनी लैब रिपोर्ट का नंबर जांचें'
                  : 'Interactive Lab Report Value Checker'}
              </span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-semibold">
              {language === 'mr' ? 'तात्काळ निकाल' : language === 'hi' ? 'तुरंत परिणाम' : 'Instant Check'}
            </span>
          </div>

          <p className="text-xs text-slate-600">
            {language === 'mr'
              ? 'कोणतीही चाचणी निवडा आणि तुमच्या लॅब रिपोर्टमधील संख्या टाकून ती सामान्य आहे का ते पहा:'
              : language === 'hi'
              ? 'कोई भी जांच चुनें और अपनी रिपोर्ट का मान दर्ज करके तुरंत जानें कि वह सामान्य है या नहीं:'
              : 'Select any blood or diagnostic test below and enter your lab report value to check if it falls within the normal range:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'mr' ? 'चाचणी निवडा (Select Test)' : language === 'hi' ? 'जांच चुनें (Select Test)' : 'Select Test'}
              </label>
              <select
                value={selectedTestId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setSelectedTestId(newId);
                  const found = LAB_TEST_REFERENCES.find((item) => item.id === newId);
                  if (found) {
                    const mid = Number(((found.normalMin + found.normalMax) / 2).toFixed(1));
                    setInputValue(String(mid));
                  }
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900"
              >
                {LAB_TEST_REFERENCES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name[language]} ({item.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'mr'
                  ? `तुमचे मूल्य (${selectedTestObj.unit})`
                  : language === 'hi'
                  ? `आपका मान (${selectedTestObj.unit})`
                  : `Your Report Value (${selectedTestObj.unit})`}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="any"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-mono tabular-nums font-semibold text-slate-900"
                  placeholder={`${selectedTestObj.normalMin} - ${selectedTestObj.normalMax}`}
                />
                <span className="text-xs font-mono text-slate-500 shrink-0">
                  {selectedTestObj.unit}
                </span>
              </div>
            </div>
          </div>

          {evaluationResult && (
            <div
              className={`p-4 rounded-xl border space-y-2 ${
                evaluationResult.status === 'normal'
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                  : evaluationResult.status === 'borderline'
                  ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                  : 'bg-red-50/90 border-red-300 text-red-950'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {evaluationResult.status === 'normal' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  ) : evaluationResult.status === 'borderline' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
                  )}
                  <span>{evaluationResult.badge}</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onSpeakText(
                      `${evaluationResult.badge}. ${evaluationResult.explanation} ${selectedTestObj.clinicalTips[language]}`
                    )
                  }
                  className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-800 border border-slate-200 cursor-pointer"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className={`leading-relaxed ${seniorMode ? 'text-base' : 'text-xs'}`}>
                {evaluationResult.explanation}
              </p>

              <div className="pt-2 border-t border-black/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                <span>
                  Normal: <strong>{selectedTestObj.normalMin} – {selectedTestObj.normalMax} {selectedTestObj.unit}</strong>
                </span>
                <span>
                  {selectedTestObj.fastingRequired
                    ? language === 'mr'
                      ? 'उपाशीपोटी चाचणी (Fasting Required)'
                      : language === 'hi'
                      ? 'खाली पेट जांच (Fasting Required)'
                      : '8–10h Fasting Required'
                    : language === 'mr'
                    ? 'कोणत्याही वेळी (No Fasting Needed)'
                    : language === 'hi'
                    ? 'किसी भी समय (No Fasting Needed)'
                    : 'No Fasting Required'}
                </span>
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            <p className="font-semibold text-slate-900">
              {language === 'mr'
                ? 'आरोग्य सल्ला (Clinical Guidance):'
                : language === 'hi'
                ? 'स्वास्थ्य सुझाव (Clinical Guidance):'
                : 'Clinical & Dietary Guidance:'}
            </p>
            <p>{selectedTestObj.clinicalTips[language]}</p>
          </div>
        </div>

        {/* Visual Normal vs Alert Threshold Chart (7 cols) */}
        <div className="lg:col-span-7 p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-700" />
                <span>
                  {language === 'mr'
                    ? 'प्रमुख रक्त व आरोग्य चाचण्यांचा तुलनात्मक आलेख (Normal vs High Threshold)'
                    : language === 'hi'
                    ? 'प्रमुख रक्त और स्वास्थ्य जांचों का तुलनात्मक चार्ट (Normal vs High Threshold)'
                    : 'Visual Reference Chart: Normal Upper Limit vs High Alert Threshold'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'mr'
                  ? 'हिरवा स्तंभ सामान्य कमाल मर्यादा दर्शवतो आणि लाल स्तंभ वैद्यकीय धोक्याची पातळी दर्शवतो'
                  : language === 'hi'
                  ? 'हरा बार सामान्य अधिकतम सीमा और लाल बार उच्च जोखिम (High Alert) स्तर दर्शाता है'
                  : 'Comparison of minimum normal, maximum healthy limit, and clinical high-alert threshold across everyday parameters'}
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="parameter" tick={{ fontSize: 11, fill: '#334155' }} />
                <YAxis tick={{ fontSize: 11, fill: '#334155' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar
                  dataKey="minNormal"
                  name={language === 'mr' ? 'किमान सामान्य (Min Normal)' : language === 'hi' ? 'न्यूनतम सामान्य (Min Normal)' : 'Min Normal'}
                  fill="#0d9488"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="maxNormal"
                  name={language === 'mr' ? 'कमाल सामान्य (Max Healthy)' : language === 'hi' ? 'अधिकतम सामान्य (Max Healthy)' : 'Max Normal Limit'}
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="alertThreshold"
                  name={language === 'mr' ? 'धोक्याची पातळी (High Alert)' : language === 'hi' ? 'उच्च जोखिम सीमा (High Alert)' : 'High Alert Threshold'}
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Age-Personalized Note */}
          <div className="p-3 rounded-xl bg-teal-50/80 border border-teal-200 flex items-center justify-between gap-3 text-xs text-teal-950">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
              <span>
                {language === 'mr'
                  ? `तुमचे वय (${userAge} वर्षे) लक्षात घेता: दर ६ ते १२ महिन्यांनी CBC, HbA1c, लिपिड प्रोफाइल, किडनी (Creatinine), थायरॉइड (TSH) आणि व्हिटॅमिन D/B12 तपासणी करणे फायदेशीर ठरते.`
                  : language === 'hi'
                  ? `आपकी आयु (${userAge} वर्ष) के अनुसार: हर 6 से 12 महीने में CBC, HbA1c, लिपिड प्रोफाइल, किडनी (Creatinine), थायरॉइड (TSH) और विटामिन D/B12 की जांच कराना उत्तम है।`
                  : `For your age (${userAge} yrs): Annual preventive screening of CBC, HbA1c, Lipid Profile, Kidney Function, Liver Function, Vitamin D/B12, and ECG is recommended.`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills + Search + Fasting Filter Bar */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'mr'
                  ? 'रक्त चाचणी किंवा तपासणी शोधा (उदा. HbA1c, CBC, Thyroid, Creatinine, ECG)...'
                  : language === 'hi'
                  ? 'कोई भी जांच खोजें (जैसे HbA1c, CBC, Thyroid, Creatinine, ECG)...'
                  : 'Search any blood or clinical test (e.g., HbA1c, Hemoglobin, LDL, Creatinine, TSH, ECG)...'
              }
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-teal-700"
            />
          </div>

          {/* Fasting Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 inline-flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-teal-700" />
              <span>
                {language === 'mr' ? 'चाचणी प्रकार:' : language === 'hi' ? 'जांच प्रकार:' : 'Preparation:'}
              </span>
            </span>
            {(
              [
                {
                  id: 'all',
                  label:
                    language === 'mr'
                      ? 'सर्व चाचण्या (All)'
                      : language === 'hi'
                      ? 'सभी जांच (All)'
                      : 'All Tests (30)',
                },
                {
                  id: 'fasting',
                  label:
                    language === 'mr'
                      ? 'उपाशीपोटी (Fasting Required)'
                      : language === 'hi'
                      ? 'खाली पेट (Fasting Required)'
                      : 'Fasting Required (8–12h)',
                },
                {
                  id: 'non_fasting',
                  label:
                    language === 'mr'
                      ? 'बिना उपाशीपोटी (Anytime)'
                      : language === 'hi'
                      ? 'बिना खाली पेट (Anytime)'
                      : 'No Fasting Needed',
                },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFastingFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  fastingFilter === f.id
                    ? 'bg-teal-800 text-white border-teal-800'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {TEST_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              <span>{cat.label[language]}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  selectedCategory === cat.id
                    ? 'bg-teal-900/60 text-teal-100'
                    : 'bg-white text-slate-600'
                }`}
              >
                {cat.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Master Normal Ranges Table & Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <Droplets className="w-5 h-5 text-teal-700" />
            <div>
              <h3 className={`font-semibold text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
                {language === 'mr'
                  ? 'वैद्यकीय चाचण्यांचा संदर्भ तक्ता (Normal, Borderline & High/Low Alert Ranges)'
                  : language === 'hi'
                  ? 'स्वास्थ्य जांच संदर्भ तालिका (Normal, Borderline & High/Low Alert Ranges)'
                  : 'Master Diagnostic Reference Chart (Normal, Borderline & Alert Ranges)'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'mr'
                  ? `एकूण ${filteredTests.length} चाचण्या दर्शविल्या आहेत · स्पीकर आयकॉनवर क्लिक करून माहिती ऐका`
                  : language === 'hi'
                  ? `कुल ${filteredTests.length} जांच प्रदर्शित · स्पीकर आइकन पर क्लिक करके विवरण सुनें`
                  : `Showing ${filteredTests.length} clinical tests · Click the speaker icon on any row to hear audio guidance`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>{language === 'mr' ? 'सामान्य (Normal)' : language === 'hi' ? 'सामान्य (Normal)' : 'Normal Healthy Range'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{language === 'mr' ? 'बॉर्डरलाईन (Borderline)' : language === 'hi' ? 'बॉर्डरलाइन (Borderline)' : 'Borderline / Precaution'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-900 border border-red-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>{language === 'mr' ? 'धोका / डॉक्टरांचा सल्ला (Alert)' : language === 'hi' ? 'जोखिम / डॉक्टर से मिलें (Alert)' : 'High / Low Clinical Alert'}</span>
            </span>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3.5 px-4">
                  {language === 'mr' ? 'चाचणीचे नाव (Test Name)' : language === 'hi' ? 'जांच का नाम (Test Name)' : 'Test Name & Code'}
                </th>
                <th className="py-3.5 px-4">
                  {language === 'mr' ? 'सामान्य प्रमाण (Normal Range)' : language === 'hi' ? 'सामान्य सीमा (Normal Range)' : 'Normal Reference Range'}
                </th>
                <th className="py-3.5 px-4">
                  {language === 'mr' ? 'बॉर्डरलाईन (Borderline)' : language === 'hi' ? 'बॉर्डरलाइन (Borderline)' : 'Borderline / Watch Zone'}
                </th>
                <th className="py-3.5 px-4">
                  {language === 'mr' ? 'धोक्याची पातळी (High/Low Alert)' : language === 'hi' ? 'असामान्य / जोखिम (High/Low Alert)' : 'Abnormal / Clinical Alert'}
                </th>
                <th className="py-3.5 px-4">
                  {language === 'mr' ? 'उपाशीपोटी / माहिती व आहार सल्ला' : language === 'hi' ? 'खाली पेट / महत्व व आहार सुझाव' : 'What It Measures & Care Tips'}
                </th>
                <th className="py-3.5 px-3 text-center">
                  {language === 'mr' ? 'ऐका' : language === 'hi' ? 'सुनें' : 'Voice'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTests.map((test) => (
                <tr
                  key={test.id}
                  className="hover:bg-slate-50/90 transition-colors align-top"
                >
                  {/* Column 1: Name & Code */}
                  <td className="py-4 px-4 min-w-[210px]">
                    <div className="flex items-start gap-2.5">
                      <span className="px-2 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 font-mono font-bold text-xs shrink-0">
                        {test.shortCode}
                      </span>
                      <div>
                        <p className={`font-semibold text-slate-900 ${seniorMode ? 'text-base' : 'text-sm'}`}>
                          {test.name[language]}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className="text-[11px] font-mono text-slate-500">
                            Unit: {test.unit}
                          </span>
                          {test.fastingRequired ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100/80 text-amber-900 text-[10px] font-semibold">
                              <Clock className="w-2.5 h-2.5" />
                              <span>
                                {language === 'mr'
                                  ? 'उपाशीपोटी (Fasting)'
                                  : language === 'hi'
                                  ? 'खाली पेट (Fasting)'
                                  : 'Fasting 8–12h'}
                              </span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                              {language === 'mr'
                                ? 'कोणत्याही वेळी'
                                : language === 'hi'
                                ? 'किसी भी समय'
                                : 'Anytime Sample'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Normal Range */}
                  <td className="py-4 px-4 min-w-[200px]">
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                      <p className={`font-mono font-bold ${seniorMode ? 'text-sm' : 'text-xs'}`}>
                        {test.normalRangeText[language]}
                      </p>
                    </div>
                  </td>

                  {/* Column 3: Borderline Range */}
                  <td className="py-4 px-4 min-w-[180px]">
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950">
                      <p className={`font-mono font-semibold ${seniorMode ? 'text-sm' : 'text-xs'}`}>
                        {test.borderlineRangeText[language]}
                      </p>
                    </div>
                  </td>

                  {/* Column 4: Abnormal / Alert Range */}
                  <td className="py-4 px-4 min-w-[200px]">
                    <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-200 text-red-950">
                      <p className={`font-mono font-semibold ${seniorMode ? 'text-sm' : 'text-xs'}`}>
                        {test.abnormalRangeText[language]}
                      </p>
                    </div>
                  </td>

                  {/* Column 5: What it measures & Clinical Tip */}
                  <td className="py-4 px-4 min-w-[270px] space-y-1.5">
                    <p className={`text-slate-700 ${seniorMode ? 'text-sm' : 'text-xs'}`}>
                      {test.whatItMeasures[language]}
                    </p>
                    <p className="text-[11px] text-teal-800 bg-teal-50/70 border border-teal-100 rounded-lg px-2.5 py-1.5 font-medium">
                      <strong>
                        {language === 'mr' ? 'सल्ला: ' : language === 'hi' ? 'सुझाव: ' : 'Tip: '}
                      </strong>
                      {test.clinicalTips[language]}
                    </p>
                  </td>

                  {/* Column 6: Voice Read Aloud + Quick Select */}
                  <td className="py-4 px-3 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          onSpeakText(
                            `${test.name[language]}. ${
                              language === 'mr'
                                ? 'सामान्य प्रमाण:'
                                : language === 'hi'
                                ? 'सामान्य सीमा:'
                                : 'Normal range:'
                            } ${test.normalRangeText[language]}. ${test.whatItMeasures[language]} ${test.clinicalTips[language]}`
                          )
                        }
                        className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-teal-50 text-teal-800 transition-colors cursor-pointer"
                        title="Read Aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTestId(test.id);
                          const mid = Number(((test.normalMin + test.normalMax) / 2).toFixed(1));
                          setInputValue(String(mid));
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-[10px] font-semibold text-teal-700 hover:underline cursor-pointer"
                      >
                        {language === 'mr' ? 'तपासा' : language === 'hi' ? 'जांचें' : 'Check'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Note Footer */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <p>
          {language === 'mr'
            ? 'वैद्यकीय सूचना: वरील रक्त आणि निदान चाचण्यांचे सामान्य प्रमाण ICMR / WHO मानकांनुसार प्रौढ व ज्येष्ठ नागरिकांसाठी दिले आहे. प्रत्येक लॅबच्या उपकरणांनुसार किंचित फरक असू शकतो. कोणत्याही असामान्य रिपोर्टसाठी आपल्या डॉक्टरांचा सल्ला अवश्य घ्या.'
            : language === 'hi'
            ? 'चिकित्सा सूचना: उपरोक्त रक्त और स्वास्थ्य जांच की सामान्य सीमाएं वयस्कों और वरिष्ठ नागरिकों के मानक ICMR / WHO संदर्भों पर आधारित हैं। विभिन्न प्रयोगशालाओं (Labs) के उपकरणों के अनुसार इनमें मामूली अंतर हो सकता है। सटीक निदान के लिए अपने डॉक्टर से परामर्श लें।'
            : 'Clinical Reference Note: Standard adult and senior reference intervals shown above follow general ICMR/WHO clinical pathology guidelines. Slight variations may occur across different laboratory analyzers and reagents. Always correlate results with your physician.'}
        </p>
      </div>
    </div>
  );
};
