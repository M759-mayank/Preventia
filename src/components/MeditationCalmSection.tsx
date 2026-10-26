import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Language } from '../i18n/translations';
import {
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  Video,
  HeartPulse,
  Moon,
  Sun,
  Wind,
  CheckCircle2,
  Clock,
  SkipForward,
  SkipBack,
  RotateCcw,
  Smile,
  BookOpen,
  Radio,
} from 'lucide-react';

export interface MeditationVideoItem {
  id: string;
  num: string;
  title: Record<Language, string>;
  instructor: Record<Language, string>;
  duration: string;
  focusTag: Record<Language, string>;
  youtubeEmbedId: Record<Language, string>;
  youtubeChannelLabel: Record<Language, string>;
  themeGradient: string;
  breathingTempoSec: number;
  description: Record<Language, string>;
  guidedSteps: Record<Language, string[]>;
  voiceNarration: Record<Language, string>;
}

export interface MeditationSongItem {
  id: string;
  num: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  frequencyLabel: string;
  durationLabel: string;
  moodBenefit: Record<Language, string>;
  // Web Audio harmonic profile for authentic, continuous soothing synthesis
  baseFreq: number;
  chordMultipliers: number[];
  melodyNotes: number[];
  chimeIntervalMs: number;
  includeSoftRain: boolean;
  waveType: OscillatorType;
}

export const MEDITATION_VIDEOS: MeditationVideoItem[] = [
  {
    id: 'vid_1',
    num: '01',
    title: {
      en: 'Morning Prana & Gentle Sunrise Breath Meditation',
      hi: 'सुबह का प्राण ध्यान और शांत सूर्योदय श्वास अभ्यास',
      mr: 'सकाळचे प्राण ध्यान आणि शांत सूर्योदय श्वास साधना',
    },
    instructor: {
      en: 'Guided Mindfulness · Morning BP & Cortisol Control',
      hi: 'प्रातःकालीन ध्यान · बीपी और तनाव नियंत्रण',
      mr: 'प्रातःकालीन ध्यान · रक्तदाब आणि तणाव नियंत्रण',
    },
    duration: '10:00 Min',
    focusTag: {
      en: 'Calm Morning Energy & Blood Pressure Stability',
      hi: 'सुबह की सकारात्मक ऊर्जा और रक्तचाप संतुलन',
      mr: 'सकाळची प्रसन्न ऊर्जा आणि रक्तदाब संतुलन',
    },
    youtubeEmbedId: {
      en: 'inpok4MKVLM',
      hi: 'huJGyXp0Z94',
      mr: 'tX1ZxQlmT1A',
    },
    youtubeChannelLabel: {
      en: 'Goodful · 5-Minute Morning Calm Meditation (English)',
      hi: 'Idanim Hindi · सुबह की सकारात्मक ऊर्जा ध्यान (हिंदी YouTube)',
      mr: 'मन:संस्कार · प्रत्येक दिवसासाठी सकारात्मक ध्यान (मराठी YouTube)',
    },
    themeGradient: 'from-teal-900 via-emerald-900 to-slate-900',
    breathingTempoSec: 5,
    description: {
      en: 'Start your morning with slow, rhythmic diaphragmatic breathing that gently lowers morning blood pressure surges and fills your mind with calm, optimistic energy.',
      hi: 'सुबह के समय धीमी और गहरी सांसों के साथ किया गया यह ध्यान सुबह के बढ़े हुए रक्तचाप (BP) को शांत करता है और पूरे दिन के लिए मन में प्रसन्नता लाता है।',
      mr: 'सकाळच्या वेळी संथ आणि दीर्घ श्वासासह केलेले हे ध्यान सकाळचा वाढलेला रक्तदाब (BP) शांत करते आणि दिवसभरासाठी मनात प्रसन्नता निर्माण करते.',
    },
    guidedSteps: {
      en: [
        'Sit comfortably on a chair or cushion with your spine gently upright and shoulders relaxed.',
        'Place your palms softly on your lap facing upward to welcome morning calmness.',
        'Inhale slowly through your nose for 4 seconds, feeling your abdomen gently expand.',
        'Exhale softly for 6 seconds while silently repeating "Peace Within" and releasing tension.',
      ],
      hi: [
        'कुर्सी या आसन पर रीढ़ को सीधा और कंधों को ढीला छोड़कर आराम से बैठें।',
        'दोनों हथेलियों को गोद में ऊपर की ओर खुला रखें और आंखें कोमलता से बंद करें।',
        '4 सेकंड तक नाक से धीरे-धीरे सांस अंदर लें और पेट को हल्का फूलने दें।',
        '6 सेकंड तक धीरे-धीरे सांस छोड़ें और मन ही मन "शांति और आनंद" का अनुभव करें।',
      ],
      mr: [
        'खुर्चीवर किंवा आसनावर पाठ सरळ आणि खांदे सैल सोडून आरामात बसा.',
        'दोन्ही तळहात मांडीवर वरच्या दिशेने ठेवा आणि डोळे अलगद मिटून घ्या.',
        '४ सेकंद नाकाने सावकाश श्वास आत घ्या आणि शांततेचा अनुभव घ्या.',
        '६ सेकंद सावकाश श्वास सोडताना शरीरातील सर्व ताण बाहेर पडत असल्याची कल्पना करा.',
      ],
    },
    voiceNarration: {
      en: 'Welcome to Morning Prana Meditation. Sit comfortably and relax your shoulders. Inhale peace slowly through your nose for four seconds. Hold gently. Now exhale slowly for six seconds, letting go of all worries. Your heart rate is calm, and your mind is joyful.',
      hi: 'सुबह के प्राण ध्यान में आपका स्वागत है। आराम से बैठें और अपने कंधों को ढीला छोड़ दें। चार सेकंड तक धीरे-धीरे शांति की सांस अंदर लें। अब छह सेकंड में धीरे-धीरे सांस बाहर छोड़ें और हर चिंता को दूर जाने दें। आपका मन शांत और प्रसन्न है।',
      mr: 'सकाळच्या प्राण ध्यानात तुमचे स्वागत आहे. आरामात बसा आणि खांदे सैल सोडा. चार सेकंद सावकाश शांततेचा श्वास आत घ्या. आता सहा सेकंदात सावकाश श्वास बाहेर सोडा आणि सर्व काळजी दूर करा. तुमचे मन अत्यंत शांत आणि आनंदी झाले आहे.',
    },
  },
  {
    id: 'vid_2',
    num: '02',
    title: {
      en: 'Senior-Safe Seated Body Scan for Deep Muscle & Joint Relief',
      hi: 'वरिष्ठ नागरिकों के लिए बॉडी स्कैन ध्यान (मांसपेशियों और जोड़ों को आराम)',
      mr: 'ज्येष्ठ नागरिकांसाठी बॉडी स्कॅन ध्यान (स्नायू आणि सांध्यांना आराम)',
    },
    instructor: {
      en: 'Clinical Relaxation · Neck, Shoulder & Knee Tension Release',
      hi: 'शारीरिक विश्राम · गर्दन, कंधे और घुटनों के तनाव से मुक्ति',
      mr: 'शारीरिक विश्रांती · मान, खांदे आणि गुडघ्यांच्या ताणातून आराम',
    },
    duration: '15:00 Min',
    focusTag: {
      en: 'Pain Relief & Nervous System Relaxation',
      hi: 'दर्द निवारण और स्नायु तंत्र की शांति',
      mr: 'वेदना निवारण आणि मज्जासंस्थेची शांतता',
    },
    youtubeEmbedId: {
      en: '15q-N-_kkrU',
      hi: 'hhbdTZWuUeg',
      mr: 'R-iVvgOBuIw',
    },
    youtubeChannelLabel: {
      en: 'Guided Mindfulness · Full Body Scan Relaxation (English)',
      hi: 'Dhyan & Healing · फुल बॉडी स्कैन और हीलिंग ध्यान (हिंदी YouTube)',
      mr: 'Niraamay Wellness · संपूर्ण शरीर आणि मनस्वास्थ्यासाठी ध्यान (मराठी YouTube)',
    },
    themeGradient: 'from-slate-900 via-teal-950 to-cyan-900',
    breathingTempoSec: 6,
    description: {
      en: 'A gentle head-to-toe awareness practice that guides warm, healing attention to your forehead, jaw, shoulders, back, and knees—reducing chronic pain perception and stiffness.',
      hi: 'सिर से पैर तक शरीर के प्रत्येक हिस्से पर कोमल ध्यान ले जाने की यह विधि जोड़ों की जकड़न, थकान और मांसपेशियों के तनाव को गहराई से शांत करती है।',
      mr: 'डोक्यापासून पायापर्यंत शरीराच्या प्रत्येक अवयवावर शांत लक्ष केंद्रित करण्याची ही पद्धत सांध्यांची आखडण, थकवा आणि स्नायूंचा ताण खोलवर कमी करते.',
    },
    guidedSteps: {
      en: [
        'Rest your back fully against a comfortable chair with your feet flat on the floor.',
        'Bring your awareness to your forehead and eyes; soften every facial muscle.',
        'Move your attention down to your neck, shoulders, arms, and hands—letting them feel warm and heavy.',
        'Send a gentle breath of gratitude to your lower back, knees, and feet.',
      ],
      hi: [
        'आरामदायक कुर्सी पर पीठ टिकाकर बैठें और दोनों पैर जमीन पर सपाट रखें।',
        'अपना ध्यान माथे और आंखों पर लाएं; चेहरे की सभी मांसपेशियों को शांत करें।',
        'धीरे-धीरे ध्यान को गर्दन, कंधों और हाथों पर लाएं और उन्हें बिल्कुल हल्का महसूस करें।',
        'अपनी कमर, घुटनों और पैरों के प्रति कृतज्ञता का भाव रखते हुए गहरी सांस लें।',
      ],
      mr: [
        'आरामदायक खुर्चीला पाठ टेकवून बसा आणि दोन्ही पाय जमिनीवर सरळ ठेवा.',
        'तुमचे लक्ष कपाळ आणि डोळ्यांवर आणा; चेहऱ्याचे सर्व स्नायू सैल करा.',
        'हळूहळू लक्ष मान, खांदे आणि हातांवर आणा आणि तिथला सर्व थकवा दूर होऊ द्या.',
        'कंबर, गुडघे आणि पायांप्रती कृतज्ञता बाळगत शांत आणि खोल श्वास घ्या.',
      ],
    },
    voiceNarration: {
      en: 'Begin your seated body scan meditation. Soften your forehead and relax your jaw. Let your shoulders drop away from your ears. Feel a wave of warm comfort flowing down through your spine, soothing your knees and ankles. Every cell in your body is resting in peace.',
      hi: 'बॉडी स्कैन ध्यान शुरू करें। अपने माथे और चेहरे को बिल्कुल शांत करें। कंधों को ढीला छोड़ दें। महसूस करें कि एक सुखद और शांत ऊर्जा आपकी पीठ, घुटनों और पैरों को गहरा आराम दे रही है। आपका पूरा शरीर स्वस्थ और शांत है।',
      mr: 'बॉडी स्कॅन ध्यानाला सुरुवात करा. तुमचे कपाळ आणि चेहरा पूर्णपणे शांत करा. खांदे सैल सोडा. एक उबदार आणि सुखद शांतता तुमच्या पाठीतून, गुडघ्यांतून आणि पायांतून वाहत असल्याचा अनुभव घ्या. तुमचे संपूर्ण शरीर निवांत झाले आहे.',
    },
  },
  {
    id: 'vid_3',
    num: '03',
    title: {
      en: 'Heart Coherence & Joyful Gratitude Mindfulness',
      hi: 'हृदय संतुलन और आनंदपूर्ण कृतज्ञता ध्यान',
      mr: 'हृदय संतुलन आणि आनंदी कृतज्ञता ध्यान (Heart Coherence)',
    },
    instructor: {
      en: 'Emotional Wellness · Heart Rate Variability & Joy',
      hi: 'भावनात्मक स्वास्थ्य · हृदय की धड़कन और मानसिक खुशी',
      mr: 'भावनिक आरोग्य · हृदयाचे ठोके आणि मानसिक आनंद',
    },
    duration: '12:00 Min',
    focusTag: {
      en: 'Happy Mood, Emotional Peace & Cardiac Calm',
      hi: 'प्रसन्न मन, भावनात्मक शांति और स्वस्थ हृदय',
      mr: 'प्रसन्न मन, भावनिक शांतता आणि निरोगी हृदय',
    },
    youtubeEmbedId: {
      en: 'ZToicYcHIOU',
      hi: 'XnT_cOq_Ba8',
      mr: 'yYrK0qqYNcg',
    },
    youtubeChannelLabel: {
      en: 'Calm Sanctuary · Mindfulness & Heart Gratitude (English)',
      hi: 'BK Shivani · मानसिक शांति और कृतज्ञता ध्यान (हिंदी YouTube)',
      mr: 'Anubhuti Yoga · सकाळचे कृतज्ञता ध्यान व शांत मन (मराठी YouTube)',
    },
    themeGradient: 'from-emerald-950 via-teal-900 to-slate-900',
    breathingTempoSec: 5,
    description: {
      en: 'Synchronizes your breath with positive feelings of gratitude and warmth in the heart center, proven to balance heart rate variability and foster a happy, resilient mindset.',
      hi: 'हृदय क्षेत्र पर ध्यान केंद्रित कर कृतज्ञता और प्रेम की भावना जगाने से हृदय की धड़कन संतुलित होती है और मन में गहरी खुशी व उत्साह का संचार होता है।',
      mr: 'हृदयावर लक्ष केंद्रित करून कृतज्ञता आणि आनंदाची भावना जागृत केल्याने हृदयाचे ठोके संतुलित राहतात आणि मनात असीम शांतता व उत्साह निर्माण होतो.',
    },
    guidedSteps: {
      en: [
        'Place your right hand gently over the center of your chest (heart center).',
        'Breathe smoothly: 5 seconds inhale and 5 seconds exhale as if breathing through your heart.',
        'Recall one happy memory, family moment, or blessing that brings a gentle smile to your face.',
        'Allow that warm feeling of gratitude to radiate throughout your entire body.',
      ],
      hi: [
        'अपना दाहिना हाथ कोमलता से अपने हृदय (सीने के मध्य) पर रखें।',
        '5 सेकंड सांस अंदर लें और 5 सेकंड सांस बाहर छोड़ें।',
        'अपने परिवार, स्वास्थ्य या जीवन के किसी एक सुखद पल को याद कर चेहरे पर हल्की मुस्कान लाएं।',
        'इस खुशी और कृतज्ञता की तरंग को पूरे शरीर में फैलने दें।',
      ],
      mr: [
        'तुमचा उजवा हात अलगद छातीच्या मध्यभागी (हृदयावर) ठेवा.',
        '५ सेकंद संथ श्वास आत घ्या आणि ५ सेकंद श्वास बाहेर सोडा.',
        'तुमच्या कुटुंबातील किंवा आयुष्यातील एका आनंदी क्षणाची आठवण करून चेहऱ्यावर मंद हास्य आणा.',
        'कृतज्ञतेची आणि आनंदाची ही उबदार भावना संपूर्ण शरीरात पसरू द्या.',
      ],
    },
    voiceNarration: {
      en: 'Place your hand gently over your heart. Breathe in warmth and gratitude for five seconds, and breathe out softly for five seconds. Bring a gentle smile to your face as you appreciate this peaceful moment. Your heart is steady, strong, and filled with happiness.',
      hi: 'अपना हाथ कोमलता से हृदय पर रखें। पांच सेकंड के लिए प्रेम और कृतज्ञता की सांस अंदर लें, और पांच सेकंड में धीरे से छोड़ें। चेहरे पर एक मधुर मुस्कान लाएं। आपका हृदय शांत, स्वस्थ और खुशियों से भरा हुआ है।',
      mr: 'तुमचा हात अलगद हृदयावर ठेवा. पाच सेकंद आनंद आणि कृतज्ञतेचा श्वास आत घ्या आणि पाच सेकंदात सावकाश सोडा. चेहऱ्यावर एक शांत स्मितहास्य येऊ द्या. तुमचे हृदय शांत, सक्षम आणि आनंदाने भरलेले आहे.',
    },
  },
  {
    id: 'vid_4',
    num: '04',
    title: {
      en: 'Peaceful Himalayan Nature & Flowing Stream Stress Release',
      hi: 'शांत हिमालयी प्रकृति और बहती नदी ध्यान (तनाव मुक्ति)',
      mr: 'शांत निसर्ग आणि वाहत्या झऱ्याचे ध्यान (ताणतणाव मुक्ती)',
    },
    instructor: {
      en: 'Nature Visualization · Anxiety & Overthinking Relief',
      hi: 'प्रकृति ध्यान · चिंता और अधिक सोचने से राहत',
      mr: 'निसर्ग ध्यान · काळजी आणि अती विचारांपासून आराम',
    },
    duration: '15:00 Min',
    focusTag: {
      en: 'Dissolve Worry & Create a Happy Inner Sanctuary',
      hi: 'चिंता मुक्त मन और सकारात्मक वातावरण',
      mr: 'चिंतामुक्त मन आणि आनंदी सकारात्मक वातावरण',
    },
    youtubeEmbedId: {
      en: 'O-6f5wQXSu8',
      hi: 'xX8swFUPhLY',
      mr: 'p7V74efI_eY',
    },
    youtubeChannelLabel: {
      en: 'Goodful · 10-Minute Stress & Anxiety Release (English)',
      hi: 'Gurudev Hindi · तनाव कम करने के लिए निर्देशित ध्यान (हिंदी YouTube)',
      mr: 'Tricks Katta · मानसिक ताण मुक्ती व शांत ध्यान साधना (मराठी YouTube)',
    },
    themeGradient: 'from-cyan-950 via-teal-900 to-emerald-950',
    breathingTempoSec: 6,
    description: {
      en: 'Guided visualization beside a crystal-clear mountain stream and sunlit green forest, helping patients release health anxieties and experience deep mental clarity.',
      hi: 'शांत पर्वत, हरियाली और बहती हुई निर्मल नदी की कल्पना पर आधारित यह ध्यान मानसिक थकान, बेचैनी और स्वास्थ्य संबंधी चिंता को दूर कर मन को तरोताजा करता है।',
      mr: 'शांत डोंगर, हिरवेगार झाडे आणि वाहत्या निर्मळ झऱ्याच्या कल्पनेवर आधारित हे ध्यान मानसिक थकवा, अस्वस्थता आणि आरोग्याची काळजी दूर करून मनाला ताजेतवाने करते.',
    },
    guidedSteps: {
      en: [
        'Close your eyes and imagine sitting beside a calm, sunlit mountain stream with fresh breeze.',
        'With every exhale, place any worried thought onto a leaf and watch it float gently downstream.',
        'Listen to the soothing rhythm of your breath mingling with peaceful nature sounds.',
        'Feel your mind becoming as clear, bright, and tranquil as the open blue sky.',
      ],
      hi: [
        'आंखें बंद करें और कल्पना करें कि आप शांत, हरी-भरी घाटी में निर्मल नदी के किनारे बैठे हैं।',
        'हर सांस छोड़ते समय अपनी किसी भी चिंता को बहते पानी के साथ दूर जाते हुए देखें।',
        'ताजी हवा और शांत वातावरण की ऊर्जा को अपने भीतर महसूस करें।',
        'आपका मन खुले नीले आकाश की तरह निर्मल, शांत और खुशहाल हो रहा है।',
      ],
      mr: [
        'डोळे मिटा आणि कल्पना करा की तुम्ही शांत, हिरव्यागार निसर्गात निर्मळ झऱ्याकाठी बसला आहात.',
        'प्रत्येक श्वास सोडताना मनातील कोणताही ताण किंवा विचार वाहत्या पाण्यासोबत दूर जाताना पहा.',
        'शुद्ध हवा आणि निसर्गातील शांतता आपल्या मनात सामावून घ्या.',
        'तुमचे मन निरभ्र आकाशासारखे स्वच्छ, शांत आणि आनंदी झाले आहे.',
      ],
    },
    voiceNarration: {
      en: 'Imagine sitting in a sunlit green valley beside a gentle, crystal-clear stream. As you breathe in, feel the fresh mountain air revitalizing your body. As you breathe out, let the flowing water carry away every worry. You are safe, calm, and surrounded by peace.',
      hi: 'कल्पना करें कि आप हरी-भरी घाटी में एक शांत नदी के किनारे बैठे हैं। सांस अंदर लेते हुए ताजी हवा की ताजगी महसूस करें, और सांस छोड़ते हुए हर तनाव को बहते पानी के साथ दूर जाने दें। आप पूरी तरह सुरक्षित, शांत और प्रसन्न हैं।',
      mr: 'कल्पना करा की तुम्ही हिरव्यागार निसर्गात एका शांत झऱ्याकाठी बसला आहात. श्वास आत घेताना शुद्ध हवेचा ताजेपणा अनुभवा आणि श्वास सोडताना सर्व ताण वाहत्या पाण्यासोबत दूर जाऊ द्या. तुम्ही पूर्णपणे सुरक्षित, शांत आणि आनंदी आहात.',
    },
  },
  {
    id: 'vid_5',
    num: '05',
    title: {
      en: 'Evening Yoga Nidra & Deep Restorative Sleep Meditation',
      hi: 'रात्रिकालीन योग निद्रा और गहरी शांत नींद का ध्यान',
      mr: 'रात्रीची योग निद्रा आणि शांत गाढ झोपेचे ध्यान',
    },
    instructor: {
      en: 'Sleep Sanctuary · Insomnia Relief & Cellular Recovery',
      hi: 'निद्रा ध्यान · अनिद्रा से राहत और गहरी विश्रांति',
      mr: 'निद्रा ध्यान · शांत झोप आणि शारीरिक पुनर्भरण',
    },
    duration: '20:00 Min',
    focusTag: {
      en: 'Uninterrupted Deep Sleep & Night BP Dipping',
      hi: 'गहरी निर्बाध नींद और रात्रि विश्राम',
      mr: 'शांत गाढ झोप आणि रात्रीची पूर्ण विश्रांती',
    },
    youtubeEmbedId: {
      en: 'aEqlQvczMJQ',
      hi: '_j0vLXonSKQ',
      mr: 'qeWfNMAfyC8',
    },
    youtubeChannelLabel: {
      en: 'Sleep Sanctuary · 20-Minute Evening Yoga Nidra (English)',
      hi: 'Anandmurti Gurumaa · रात्रिकालीन योग निद्रा ध्यान (हिंदी YouTube)',
      mr: 'OmShriOm · गाढ झोप आणि विश्रांतीसाठी योग निद्रा (मराठी YouTube)',
    },
    themeGradient: 'from-slate-950 via-indigo-950 to-teal-950',
    breathingTempoSec: 7,
    description: {
      en: 'Practice 30 minutes before bedtime to transition your nervous system into parasympathetic rest, helping seniors and patients fall asleep faster and wake up refreshed.',
      hi: 'रात को सोने से पहले किया जाने वाला यह योग निद्रा ध्यान दिन भर की थकान को मिटाकर मस्तिष्क को शांत करता है और बिना रुकावट गहरी, स्वास्थ्यवर्धक नींद दिलाता है।',
      mr: 'रात्री झोपण्यापूर्वी केलेले हे योग निद्रा ध्यान दिवसभराचा शीण घालवून मेंदूला शांत करते आणि कोणत्याही व्यत्ययाशिवाय शांत, आरोग्यदायी झोप लागण्यास मदत करते.',
    },
    guidedSteps: {
      en: [
        'Lie down comfortably on your bed or recline in a quiet, softly lit room.',
        'Take three slow 4-7-8 breaths: inhale 4 seconds, hold 4 seconds, exhale 8 seconds.',
        'Silently thank your body for supporting you through the day and give yourself permission to rest.',
        'Let your breath become effortless and natural as you drift into deep serenity.',
      ],
      hi: [
        'अपने बिस्तर पर आराम से लेट जाएं और कमरे की रोशनी धीमी रखें।',
        'तीन बार गहरी और शांत सांस लें — सांस छोड़ने का समय सांस लेने से थोड़ा लंबा रखें।',
        'दिन भर साथ देने के लिए अपने शरीर को धन्यवाद दें और सभी विचारों को विराम दें।',
        'शांत संगीत या अपनी सांसों की लय के साथ गहरी, सुखद नींद में विश्राम करें।',
      ],
      mr: [
        'तुमच्या अंथरुणावर आरामात झोपा आणि खोलीतील प्रकाश मंद ठेवा.',
        'तीन वेळा संथ आणि दीर्घ श्वास घ्या — श्वास सोडण्याचा वेळ श्वास घेण्यापेक्षा थोडा जास्त ठेवा.',
        'दिवसभर साथ दिल्याबद्दल स्वतःच्या शरीराचे आभार माना आणि सर्व विचारांना पूर्णविराम द्या.',
        'शांत सुरांच्या किंवा श्वासाच्या लयीसोबत गाढ आणि निवांत झोपेचा अनुभव घ्या.',
      ],
    },
    voiceNarration: {
      en: 'Prepare for Evening Yoga Nidra and deep restorative rest. Let your body sink softly into your cushion or bed. The day is complete, and there is nothing more you need to do. Breathe out slowly and drift into a calm, healing, and peaceful sleep.',
      hi: 'रात्रिकालीन योग निद्रा और गहरे विश्राम के लिए तैयार हो जाएं। अपने शरीर को बिल्कुल ढीला छोड़ दें। आज का दिन पूर्ण हो चुका है और अब केवल शांत विश्राम का समय है। धीरे से सांस छोड़ें और गहरी, सुखद नींद का आनंद लें।',
      mr: 'रात्रीच्या योग निद्रा आणि गाढ विश्रांतीसाठी सज्ज व्हा. तुमचे शरीर पूर्णपणे सैल सोडा. आजचा दिवस शांततेत पूर्ण झाला आहे आणि आता फक्त विश्रांतीची वेळ आहे. सावकाश श्वास सोडा आणि शांत, आरोग्यदायी झोपेचा अनुभव घ्या.',
    },
  },
];

export const MEDITATION_SONGS: MeditationSongItem[] = [
  {
    id: 'song_1',
    num: '01',
    title: {
      en: 'Raag Yaman Evening Peace & Bansuri Harmonics',
      hi: 'राग यमन संध्या शांति और बांसुरी की मधुर धुन',
      mr: 'राग यमन संध्या शांतता आणि बासरीचे मधुर सूर',
    },
    subtitle: {
      en: 'Warm Indian Classical Ambient Drone · Joyful Home Atmosphere',
      hi: 'भारतीय शास्त्रीय शांत धुन · घर में सुखद और सकारात्मक वातावरण',
      mr: 'भारतीय शास्त्रीय शांत धुन · घरात प्रसन्न आणि आनंदी वातावरण',
    },
    frequencyLabel: '432 Hz Natural Tuning',
    durationLabel: 'Continuous Loop · Calm & Happy',
    moodBenefit: {
      en: 'Uplifts mood, relieves evening fatigue & promotes family harmony',
      hi: 'शाम की थकान दूर कर मन को प्रसन्न और शांत बनाता है',
      mr: 'संध्याकाळचा थकवा दूर करून मन प्रसन्न आणि आनंदी ठेवते',
    },
    baseFreq: 216, // 432Hz octave root
    chordMultipliers: [1, 1.25, 1.5, 2],
    melodyNotes: [216, 243, 270, 303.75, 324, 364.5, 405, 432],
    chimeIntervalMs: 3200,
    includeSoftRain: false,
    waveType: 'sine',
  },
  {
    id: 'song_2',
    num: '02',
    title: {
      en: 'Tibetan Singing Bowls & Sacred Temple Resonance',
      hi: 'तिब्बती सिंगिंग बाउल और मंदिर की शांत ध्वनि तरंगें',
      mr: 'तिबेटी सिंगिंग बाउल आणि मंदिरातील शांत नाद लहरी',
    },
    subtitle: {
      en: 'Deep Harmonic Bell Overtones · Blood Pressure & Stress Relief',
      hi: 'गहरी शांत ध्वनि तरंगें · रक्तचाप (BP) और मानसिक तनाव से राहत',
      mr: 'खोल शांत नाद लहरी · रक्तदाब (BP) आणि मानसिक तणावातून आराम',
    },
    frequencyLabel: '528 Hz Solfeggio Calm',
    durationLabel: 'Continuous Loop · Deep Peace',
    moodBenefit: {
      en: 'Quiets racing thoughts and slows rapid heart rate within minutes',
      hi: 'तेज चलती धड़कनों और बेचैन विचारों को कुछ ही मिनटों में शांत करता है',
      mr: 'वाढलेले हृदयाचे ठोके आणि अस्वस्थ विचार काही मिनिटांत शांत करते',
    },
    baseFreq: 176,
    chordMultipliers: [1, 1.5, 2, 3],
    melodyNotes: [264, 352, 396, 528, 396, 352],
    chimeIntervalMs: 4200,
    includeSoftRain: false,
    waveType: 'sine',
  },
  {
    id: 'song_3',
    num: '03',
    title: {
      en: 'Monsoon Garden Rain & Soft Tanpura Serenity',
      hi: 'शांत रिमझिम बारिश और तानपुरा की सुकून भरी धुन',
      mr: 'शांत रिमझिम पाऊस आणि तानपुऱ्याचे निवांत सूर',
    },
    subtitle: {
      en: 'Acoustic Rain Soundscape + Grounding Warm Pad',
      hi: 'प्रकृति की शांत वर्षा ध्वनि और तानपुरा का मधुर संगम',
      mr: 'निसर्गातील शांत पावसाचा आवाज आणि तानपुऱ्याचा मधुर संगम',
    },
    frequencyLabel: 'Pink Noise + 256 Hz Root',
    durationLabel: 'Continuous Loop · Nature Calm',
    moodBenefit: {
      en: 'Creates a cozy, stress-free environment for reading, resting, or pranayama',
      hi: 'प्राणायाम, विश्राम और शांत वातावरण के लिए अत्यंत सुखद संगीत',
      mr: 'प्राणायाम, विश्रांती आणि शांत घरगुती वातावरणासाठी अतिशय सुखद संगीत',
    },
    baseFreq: 192,
    chordMultipliers: [1, 1.333, 1.5, 2],
    melodyNotes: [256, 288, 320, 384, 432, 384, 320],
    chimeIntervalMs: 3800,
    includeSoftRain: true,
    waveType: 'triangle',
  },
  {
    id: 'song_4',
    num: '04',
    title: {
      en: 'Joyful Lotus Heart Melody & Alpha Wave Harmony',
      hi: 'आनंदमयी कमल हृदय धुन और अल्फा तरंग संगीत',
      mr: 'आनंदमयी कमळ हृदय धुन आणि अल्फा लहरी संगीत',
    },
    subtitle: {
      en: 'Uplifting Pentatonic Chimes · Happiness & Gratitude Booster',
      hi: 'सकारात्मक ऊर्जा और खुशी बढ़ाने वाली मधुर संगीतमय धुन',
      mr: 'सकारात्मक ऊर्जा आणि आनंद वाढवणारी मधुर संगीतमय धुन',
    },
    frequencyLabel: '10 Hz Alpha Wave Harmony',
    durationLabel: 'Continuous Loop · Happy Mind',
    moodBenefit: {
      en: 'Stimulates alpha brainwaves associated with serene happiness and optimism',
      hi: 'मन में उत्साह, खुशी और सकारात्मक सोच को बढ़ावा देता है',
      mr: 'मनात उत्साह, आनंद आणि सकारात्मक विचारांची वाढ करते',
    },
    baseFreq: 240,
    chordMultipliers: [1, 1.25, 1.5, 1.875],
    melodyNotes: [240, 270, 300, 360, 400, 480, 400, 360],
    chimeIntervalMs: 2600,
    includeSoftRain: false,
    waveType: 'sine',
  },
  {
    id: 'song_5',
    num: '05',
    title: {
      en: 'Deep Night Starlight Slumber & Delta Calm Pad',
      hi: 'गहरी रात्रि विश्रांति और डेल्टा निद्रा संगीत',
      mr: 'रात्रीची गाढ झोप आणि डेल्टा शांतता संगीत',
    },
    subtitle: {
      en: 'Ultra-Soft Low-Frequency Sanctuary · Bedtime & Senior Rest',
      hi: 'अनिद्रा दूर करने और गहरी नींद के लिए शांत लो-फ्रिक्वेंसी धुन',
      mr: 'निद्रानाश दूर करण्यासाठी आणि शांत झोपेसाठी मंद लो-फ्रिक्वेन्सी धुन',
    },
    frequencyLabel: '144 Hz Deep Rest Tuning',
    durationLabel: 'Continuous Loop · Sleep Care',
    moodBenefit: {
      en: 'Helps seniors and patients fall into deep, uninterrupted restorative sleep',
      hi: 'वरिष्ठ नागरिकों और रोगियों को गहरी और शांत नींद दिलाने में सहायक',
      mr: 'ज्येष्ठ नागरिक आणि रुग्णांना शांत व गाढ झोप लागण्यास मदत करते',
    },
    baseFreq: 144,
    chordMultipliers: [1, 1.5, 2],
    melodyNotes: [144, 180, 216, 288, 216, 180],
    chimeIntervalMs: 5000,
    includeSoftRain: true,
    waveType: 'sine',
  },
];

export const MeditationCalmSection: React.FC<{
  language: Language;
  seniorMode: boolean;
  userAge: number;
  onSpeakText: (text: string) => void;
}> = ({ language, seniorMode, userAge, onSpeakText }) => {
  // Active Video Player State
  const [selectedVideoId, setSelectedVideoId] = useState<string>(MEDITATION_VIDEOS[0].id);
  const [videoPlayerMode, setVideoPlayerMode] = useState<'guided_visual' | 'youtube_embed'>(
    'youtube_embed'
  );
  const [youtubeAudioLang, setYoutubeAudioLang] = useState<Language>(language);
  const [isVisualSessionPlaying, setIsVisualSessionPlaying] = useState<boolean>(true);

  // Sync YouTube video language automatically whenever the user changes the app language
  useEffect(() => {
    setYoutubeAudioLang(language);
  }, [language]);

  // Guided Breathing Timer State (4-4-6 Calm Breath)
  const [breathingActive, setBreathingActive] = useState<boolean>(false);
  const [breathSeconds, setBreathSeconds] = useState<number>(0);

  // Active Meditation Song Player State (Web Audio Synthesizer)
  const [activeSongId, setActiveSongId] = useState<string>(MEDITATION_SONGS[0].id);
  const [isPlayingSong, setIsPlayingSong] = useState<boolean>(false);
  const [songVolume, setSongVolume] = useState<number>(0.65);
  const [songElapsedSec, setSongElapsedSec] = useState<number>(0);
  const [sleepTimerMin, setSleepTimerMin] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);
  const chimeIntervalRef = useRef<number | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  const selectedVideo =
    MEDITATION_VIDEOS.find((v) => v.id === selectedVideoId) || MEDITATION_VIDEOS[0];
  const activeSong =
    MEDITATION_SONGS.find((s) => s.id === activeSongId) || MEDITATION_SONGS[0];

  // Stop & clean up Web Audio meditation music synthesizer
  const stopMeditationAudio = useCallback(() => {
    if (chimeIntervalRef.current) {
      window.clearInterval(chimeIntervalRef.current);
      chimeIntervalRef.current = null;
    }
    activeOscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignore already stopped
      }
    });
    activeOscillatorsRef.current = [];
    if (noiseNodeRef.current) {
      try {
        noiseNodeRef.current.disconnect();
      } catch {
        // Ignore
      }
      noiseNodeRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    masterGainRef.current = null;
    setIsPlayingSong(false);
  }, []);

  // Start soothing multi-layered Web Audio meditation song
  const startMeditationSong = useCallback(
    (song: MeditationSongItem) => {
      stopMeditationAudio();

      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(songVolume * 0.28, ctx.currentTime + 1.8);
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        // 1. Warm Harmonic Drone Pad Oscillators
        const oscs: OscillatorNode[] = [];
        song.chordMultipliers.forEach((mult, idx) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = idx === 0 ? 'sine' : song.waveType;
          osc.frequency.setValueAtTime(song.baseFreq * mult, ctx.currentTime);
          // Subtle detune for warm chorus richness
          osc.detune.setValueAtTime((idx - 1.5) * 4, ctx.currentTime);

          const layerVol = idx === 0 ? 0.35 : 0.16 / idx;
          oscGain.gain.setValueAtTime(layerVol, ctx.currentTime);

          osc.connect(oscGain);
          oscGain.connect(masterGain);
          osc.start();
          oscs.push(osc);
        });
        activeOscillatorsRef.current = oscs;

        // 2. Optional Soft Rain / Gentle Breeze Soundscape (Filtered Pink Noise)
        if (song.includeSoftRain) {
          const bufferSize = ctx.sampleRate * 3;
          const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let b0 = 0,
            b1 = 0,
            b2 = 0,
            b3 = 0,
            b4 = 0,
            b5 = 0,
            b6 = 0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.015;
            b6 = white * 0.115926;
          }
          const whiteNoise = ctx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          whiteNoise.loop = true;

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(650, ctx.currentTime);

          const rainGain = ctx.createGain();
          rainGain.gain.setValueAtTime(0.35, ctx.currentTime);

          whiteNoise.connect(filter);
          filter.connect(rainGain);
          rainGain.connect(masterGain);
          whiteNoise.start();
          noiseNodeRef.current = whiteNoise;
        }

        // 3. Melodic Singing Bowl / Bansuri Chime Notes
        let noteIdx = 0;
        const playGentleChime = () => {
          if (!audioCtxRef.current || audioCtxRef.current.state !== 'running' || !masterGainRef.current)
            return;
          const now = audioCtxRef.current.currentTime;
          const noteFreq = song.melodyNotes[noteIdx % song.melodyNotes.length];
          noteIdx += 1;

          const chimeOsc = audioCtxRef.current.createOscillator();
          const chimeGain = audioCtxRef.current.createGain();
          chimeOsc.type = 'sine';
          chimeOsc.frequency.setValueAtTime(noteFreq, now);

          chimeGain.gain.setValueAtTime(0.001, now);
          chimeGain.gain.linearRampToValueAtTime(0.26, now + 0.35);
          chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 3.4);

          chimeOsc.connect(chimeGain);
          chimeGain.connect(masterGainRef.current);
          chimeOsc.start(now);
          chimeOsc.stop(now + 3.5);
        };

        playGentleChime();
        chimeIntervalRef.current = window.setInterval(playGentleChime, song.chimeIntervalMs);

        setActiveSongId(song.id);
        setIsPlayingSong(true);
      } catch {
        setIsPlayingSong(false);
      }
    },
    [songVolume, stopMeditationAudio]
  );

  // Adjust master gain smoothly when volume slider changes
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        songVolume * 0.28,
        audioCtxRef.current.currentTime,
        0.15
      );
    }
  }, [songVolume]);

  // Song elapsed timer & auto sleep timer
  useEffect(() => {
    if (!isPlayingSong) return;
    const t = window.setInterval(() => {
      setSongElapsedSec((prev) => {
        const next = prev + 1;
        if (sleepTimerMin && next >= sleepTimerMin * 60) {
          stopMeditationAudio();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [isPlayingSong, sleepTimerMin, stopMeditationAudio]);

  // Guided breathing timer
  useEffect(() => {
    if (!breathingActive) return;
    const t = window.setInterval(() => {
      setBreathSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(t);
  }, [breathingActive]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopMeditationAudio();
    };
  }, [stopMeditationAudio]);

  const handleTogglePlaySong = (song: MeditationSongItem) => {
    if (isPlayingSong && activeSongId === song.id) {
      stopMeditationAudio();
    } else {
      setSongElapsedSec(0);
      startMeditationSong(song);
    }
  };

  const handleSkipSong = (dir: 1 | -1) => {
    const currentIdx = MEDITATION_SONGS.findIndex((s) => s.id === activeSongId);
    const nextIdx = (currentIdx + dir + MEDITATION_SONGS.length) % MEDITATION_SONGS.length;
    const nextSong = MEDITATION_SONGS[nextIdx];
    setSongElapsedSec(0);
    startMeditationSong(nextSong);
  };

  const formatMinutesSeconds = (totalSec: number) => {
    const m = Math.floor(totalSec / 60)
      .toString()
      .padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Determine 14-second breathing cycle phase (4s Inhale, 4s Hold, 6s Exhale)
  const cyclePos = breathSeconds % 14;
  const breathPhase =
    cyclePos < 4
      ? {
          en: 'Inhale Peace Slowly (4s)...',
          hi: 'धीरे-धीरे शांति की सांस अंदर लें (4s)...',
          mr: 'सावकाश शांततेचा श्वास आत घ्या (4s)...',
          scale: 'scale-110 bg-teal-600',
        }
      : cyclePos < 8
      ? {
          en: 'Hold Calmly Within (4s)...',
          hi: 'सांस को सहजता से रोकें (4s)...',
          mr: 'श्वास सहजपणे रोखून धरा (4s)...',
          scale: 'scale-110 bg-emerald-700',
        }
      : {
          en: 'Exhale All Stress & Smile (6s)...',
          hi: 'धीरे-धीरे सारा तनाव बाहर छोड़ें (6s)...',
          mr: 'सावकाश सर्व ताण बाहेर सोडा (6s)...',
          scale: 'scale-95 bg-cyan-800',
        };

  const copy = {
    en: {
      badge: 'Patient Mind-Body Sanctuary · Stress & Blood Pressure Relief',
      title: 'Meditation Guide, 5 Calm Videos & 5 Soothing Meditation Songs',
      subtitle:
        'Create a calm, happy, and healing environment at home. Daily 10-minute mindfulness lowers blood pressure, stabilizes blood sugar, relieves anxiety, and promotes deep restorative sleep.',
      infoHeading: '01. Why Daily Meditation Is Essential for Preventive Health & Happiness',
      infoCards: [
        {
          title: 'Lowers Blood Pressure & Heart Strain',
          desc: 'Slow mindful breathing activates the vagus nerve, reducing systolic blood pressure by 5–10 mmHg and calming rapid heartbeats.',
          metric: '−5 to −10 mmHg Systolic BP',
        },
        {
          title: 'Reduces Stress Cortisol & Blood Sugar Spikes',
          desc: 'Mental stress raises cortisol, which triggers fasting blood glucose spikes. Meditation restores hormonal balance and insulin sensitivity.',
          metric: 'Balances Cortisol & Glycemia',
        },
        {
          title: 'Deep Restorative Sleep & Happy Mood',
          desc: 'Boosts natural serotonin, melatonin, and alpha brainwaves—dissolving loneliness, worry, and night-time insomnia in seniors and adults.',
          metric: '+40% Deeper Night Sleep',
        },
      ],
      breathingBoxTitle: 'Interactive 4-4-6 Calm Breathing Coach',
      breathingBoxSub: 'Follow the gentle breathing circle for 2 minutes to feel instant calm.',
      startBreathing: 'Start Guided Breath',
      pauseBreathing: 'Pause Breath Timer',
      videosHeading: '02. 5 Guided Meditation & Calm Videos',
      videosSub:
        'Select any of the 5 guided video sessions below. Switch between the Interactive Visual Breathing Player (with Female Voice Guide) or YouTube Video Embed.',
      visualModeBtn: 'Interactive Calm Visual + Voice',
      youtubeModeBtn: 'YouTube Video Player',
      listenVoiceGuide: 'Listen to Guided Meditation (Female Voice)',
      songsHeading: '03. 5 Meditation Songs for a Calm & Happy Environment',
      songsSub:
        'Click Play on any of the 5 therapeutic soundscapes below to fill your room with soothing bansuri harmonics, singing bowls, gentle rain, and alpha-wave peace.',
      nowPlaying: 'Now Playing Calm Sanctuary Audio',
      pausedAudio: 'Select a Song Below to Start Calm Environment Music',
      volumeLabel: 'Volume',
      sleepTimerLabel: 'Auto-Off Timer:',
    },
    hi: {
      badge: 'मानसिक शांति और खुशी का केंद्र · बीपी और तनाव नियंत्रण',
      title: 'ध्यान (Meditation) मार्गदर्शन, 5 शांत वीडियो और 5 मधुर ध्यान गीत',
      subtitle:
        'अपने घर में शांत, खुशहाल और सकारात्मक वातावरण बनाएं। प्रतिदिन 10 मिनट का ध्यान उच्च रक्तचाप (BP), शुगर, चिंता और अनिद्रा को दूर करने में अत्यंत प्रभावी है।',
      infoHeading: '01. अच्छे स्वास्थ्य और प्रसन्न मन के लिए दैनिक ध्यान क्यों जरूरी है?',
      infoCards: [
        {
          title: 'उच्च रक्तचाप (BP) और हृदय गति में संतुलन',
          desc: 'धीमी और गहरी सांसों के साथ ध्यान करने से नसों का तनाव कम होता है और सिस्टोलिक बीपी 5 से 10 mmHg तक स्वाभाविक रूप से शांत होता है।',
          metric: 'बीपी और हृदय के लिए लाभकारी',
        },
        {
          title: 'तनाव हार्मोन (Cortisol) और ब्लड शुगर नियंत्रण',
          desc: 'मानसिक चिंता से शरीर में शुगर का स्तर बढ़ता है। नियमित ध्यान तनाव हार्मोन को घटाकर मधुमेह नियंत्रण में मदद करता है।',
          metric: 'शुगर और तनाव में कमी',
        },
        {
          title: 'गहरी नींद और हमेशा प्रसन्न रहने वाला मन',
          desc: 'ध्यान मस्तिष्क में अल्फा तरंगें और सेरोटोनिन बढ़ाता है, जिससे घबराहट दूर होती है और रात में गहरी, सुखद नींद आती है।',
          metric: 'गहरी नींद और मानसिक खुशी',
        },
      ],
      breathingBoxTitle: 'इंटरएक्टिव 4-4-6 शांत श्वास अभ्यास कोच',
      breathingBoxSub: 'तुरंत मानसिक शांति पाने के लिए 2 मिनट तक इस श्वास चक्र का अनुसरण करें।',
      startBreathing: 'श्वास अभ्यास शुरू करें',
      pauseBreathing: 'अभ्यास रोकें',
      videosHeading: '02. 5 निर्देशित ध्यान (Meditation) और शांत वीडियो सत्र',
      videosSub:
        'नीचे दिए गए 5 ध्यान वीडियो में से कोई भी चुनें। आप इसे इंटरएक्टिव विजुअल प्लेयर (महिला आवाज के साथ) या यूट्यूब वीडियो में देख सकते हैं।',
      visualModeBtn: 'शांत विजुअल प्लेयर + महिला आवाज',
      youtubeModeBtn: 'यूट्यूब वीडियो प्लेयर',
      listenVoiceGuide: 'महिला आवाज में ध्यान मार्गदर्शन सुनें',
      songsHeading: '03. शांत और खुशहाल वातावरण के लिए 5 मधुर ध्यान गीत (Meditation Songs)',
      songsSub:
        'अपने घर और मन को शांत व आनंदित करने के लिए नीचे दिए गए 5 ध्यान गीतों (बांसुरी, सिंगिंग बाउल, शांत बारिश और अल्फा संगीत) में से कोई भी बजाएं।',
      nowPlaying: 'अभी बज रहा है — शांत ध्यान संगीत',
      pausedAudio: 'शांत वातावरण के लिए नीचे किसी भी गीत पर Play दबाएं',
      volumeLabel: 'आवाज',
      sleepTimerLabel: 'ऑटो-ऑफ टाइमर:',
    },
    mr: {
      badge: 'मानसिक शांतता आणि आनंदाचे केंद्र · रक्तदाब व तणाव मुक्ती',
      title: 'ध्यान (Meditation) माहिती, ५ शांत व्हिडिओ आणि ५ मधुर ध्यान गीते',
      subtitle:
        'तुमच्या घरात शांत, आनंदी आणि सकारात्मक वातावरण निर्माण करा. दररोज १० मिनिटे ध्यान केल्याने उच्च रक्तदाब (BP), शुगर, काळजी आणि निद्रानाश दूर होतो.',
      infoHeading: '01. उत्तम आरोग्य आणि आनंदी मनासाठी दररोज ध्यान करणे का महत्त्वाचे आहे?',
      infoCards: [
        {
          title: 'रक्तदाब (BP) आणि हृदयाच्या ठोक्यांचे संतुलन',
          desc: 'संथ आणि दीर्घ श्वासासह ध्यान केल्याने रक्तवाहिन्यांवरील ताण कमी होतो आणि सिस्टोलिक रक्तदाब ५ ते १० mmHg ने नैसर्गिकरीत्या नियंत्रित राहतो.',
          metric: 'रक्तदाब आणि हृदयासाठी उपयुक्त',
        },
        {
          title: 'ताणतणाव (Cortisol) आणि रक्तातील साखर नियंत्रण',
          desc: 'मानसिक ताणामुळे शरीरातील साखर वाढते. नियमित ध्यानामुळे कॉर्टिसोल संप्रेरक कमी होऊन मधुमेह नियंत्रणात मोठी मदत होते.',
          metric: 'शुगर आणि तणाव नियंत्रण',
        },
        {
          title: 'शांत गाढ झोप आणि नेहमी प्रसन्न राहणारे मन',
          desc: 'ध्यानामुळे मेंदूमध्ये अल्फा लहरी आणि आनंदी संप्रेरके वाढतात, ज्यामुळे एकटेपणा व अस्वस्थता दूर होऊन रात्री शांत झोप लागते.',
          metric: 'गाढ झोप आणि मानसिक आनंद',
        },
      ],
      breathingBoxTitle: 'इंटरएक्टिव्ह ४-४-६ शांत श्वास साधना कोच',
      breathingBoxSub: 'तात्काळ मानसिक शांतता मिळवण्यासाठी २ मिनिटे या श्वास चक्राचे अनुसरण करा.',
      startBreathing: 'श्वास साधना सुरू करा',
      pauseBreathing: 'साधना थांबवा',
      videosHeading: '02. ५ मार्गदर्शित ध्यान (Meditation) आणि शांतता व्हिडिओ सत्रे',
      videosSub:
        'खालील ५ ध्यान व्हिडिओंपैकी कोणताही व्हिडिओ निवडा. तुम्ही तो इंटरएक्टिव्ह व्हिज्युअल प्लेयर (महिला आवाजासह) किंवा YouTube व्हिडिओमध्ये पाहू शकता.',
      visualModeBtn: 'शांत व्हिज्युअल प्लेयर + महिला आवाज',
      youtubeModeBtn: 'YouTube व्हिडिओ प्लेयर',
      listenVoiceGuide: 'महिला आवाजात ध्यान मार्गदर्शन ऐका',
      songsHeading: '03. शांत आणि आनंदी वातावरणासाठी ५ मधुर ध्यान गीते (Meditation Songs)',
      songsSub:
        'तुमचे घर आणि मन शांत व आनंदी करण्यासाठी खालील ५ ध्यान गीतांपैकी (बासरीचे सूर, सिंगिंग बाउल, रिमझिम पाऊस आणि अल्फा संगीत) कोणतेही गीत प्ले करा.',
      nowPlaying: 'आता सुरू आहे — शांत ध्यान संगीत',
      pausedAudio: 'शांत आणि आनंदी वातावरणासाठी खालील कोणत्याही गाण्यावर Play दाबा',
      volumeLabel: 'आवाज',
      sleepTimerLabel: 'ऑटो-ऑफ टायमर:',
    },
  }[language];

  return (
    <div className="space-y-6">
      {/* =====================================================================
          HERO & SECTION 1: MEDITATION INFORMATION, CLINICAL BENEFITS & BREATHING COACH
      ===================================================================== */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
              <Sparkles className="w-4 h-4 text-teal-700" />
              <span>{copy.badge}</span>
            </div>
            <h2
              className={`font-display font-semibold text-slate-900 ${
                seniorMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
              }`}
            >
              {copy.title}
            </h2>
            <p
              className={`text-slate-600 max-w-[75ch] leading-relaxed ${
                seniorMode ? 'text-base' : 'text-sm'
              }`}
            >
              {copy.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onSpeakText(
                `${copy.title}. ${copy.subtitle}. ${copy.infoCards
                  .map((c) => `${c.title}: ${c.desc}`)
                  .join(' ')}`
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 text-xs font-semibold hover:bg-teal-100 transition-colors self-start whitespace-nowrap cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-teal-700" />
            <span>{copy.listenVoiceGuide}</span>
          </button>
        </div>

        {/* Meditation Science & Benefits + Live 4-4-6 Breathing Coach */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left 7 Cols: Meditation Information & Age-Wise Practice Guide */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-semibold text-slate-900 text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-700" />
              <span>{copy.infoHeading}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {copy.infoCards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-teal-800 font-mono font-semibold">
                      <span>0{idx + 1}</span>
                      <HeartPulse className="w-4 h-4 text-teal-700" />
                    </div>
                    <h4 className="font-semibold text-slate-900 text-sm">{card.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
                  </div>
                  <p className="text-[11px] font-semibold text-teal-800 pt-2 border-t border-slate-200/80">
                    {card.metric}
                  </p>
                </div>
              ))}
            </div>

            {/* Best Times & Posture Guidelines for Patients */}
            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2">
              <h4 className="text-xs font-semibold text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-teal-700" />
                <span>
                  {language === 'mr'
                    ? `तुमच्या वयानुसार (${userAge} वर्षे) दैनंदिन ध्यान वेळापत्रक`
                    : language === 'hi'
                    ? `आपकी आयु (${userAge} वर्ष) के अनुसार दैनिक ध्यान दिनचर्या`
                    : `Recommended Daily Meditation Routine for Your Age (${userAge} yrs)`}
                </span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-teal-900 pt-1">
                <div className="p-2.5 rounded-lg bg-white/90 border border-teal-200/70">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      {language === 'mr'
                        ? 'सकाळी ७:०० — १० मिनिटे'
                        : language === 'hi'
                        ? 'सुबह 7:00 — 10 मिनट'
                        : 'Morning 7:00 AM — 10 Min'}
                    </span>
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    {language === 'mr'
                      ? 'सूर्योदय प्राण ध्यान व दीर्घ श्वास (रक्तदाब नियंत्रणासाठी).'
                      : language === 'hi'
                      ? 'सूर्योदय प्राण ध्यान और गहरी सांस (बीपी नियंत्रण के लिए)।'
                      : 'Sunrise Prana breath awareness before breakfast for steady BP.'}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/90 border border-teal-200/70">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-teal-700" />
                    <span>
                      {language === 'mr'
                        ? 'संध्याकाळी ६:०० — १५ मिनिटे'
                        : language === 'hi'
                        ? 'शाम 6:00 — 15 मिनट'
                        : 'Evening 6:00 PM — 15 Min'}
                    </span>
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    {language === 'mr'
                      ? 'राग यमन किंवा बासरीचे शांत संगीत ऐकत थकवा दूर करा.'
                      : language === 'hi'
                      ? 'राग यमन या बांसुरी संगीत सुनते हुए दिन की थकान मिटाएं।'
                      : 'Listen to Raag Yaman or Singing Bowls to release daytime stress.'}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/90 border border-teal-200/70">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-indigo-700" />
                    <span>
                      {language === 'mr'
                        ? 'रात्री ९:३० — १५ मिनिटे'
                        : language === 'hi'
                        ? 'रात 9:30 — 15 मिनट'
                        : 'Bedtime 9:30 PM — 15 Min'}
                    </span>
                  </p>
                  <p className="text-slate-600 mt-0.5">
                    {language === 'mr'
                      ? 'योग निद्रा आणि शांत झोपेचे ध्यान (गाढ झोपेसाठी).'
                      : language === 'hi'
                      ? 'योग निद्रा और बॉडी स्कैन (बिना रुकावट गहरी नींद के लिए)।'
                      : 'Seated or lying Body Scan & Yoga Nidra for uninterrupted sleep.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Interactive 4-4-6 Guided Breathing Coach */}
          <div className="lg:col-span-5 p-5 rounded-xl bg-slate-900 text-white flex flex-col justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-teal-300 uppercase tracking-wider">
                  Live Paced Breathing
                </span>
                <span className="text-xs font-mono text-slate-300">
                  {formatMinutesSeconds(breathSeconds)}
                </span>
              </div>
              <h3 className="font-semibold text-base text-white">{copy.breathingBoxTitle}</h3>
              <p className="text-xs text-slate-300">{copy.breathingBoxSub}</p>
            </div>

            {/* Animated Breathing Circle */}
            <div className="py-4 flex flex-col items-center justify-center">
              <div
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center text-center p-4 transition-all duration-1000 border-4 border-teal-300/40 shadow-lg ${
                  breathingActive ? breathPhase.scale : 'bg-teal-800/80 scale-100'
                }`}
              >
                <Wind className="w-6 h-6 text-teal-200 mb-1" />
                <p className="text-xs font-semibold text-white leading-snug">
                  {breathingActive
                    ? breathPhase[language]
                    : language === 'mr'
                    ? 'शांत श्वासासाठी सुरू करा'
                    : language === 'hi'
                    ? 'शांत श्वास के लिए शुरू करें'
                    : 'Ready for Calm Breath'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setBreathingActive((prev) => !prev)}
                className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  breathingActive
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    : 'bg-teal-600 text-white hover:bg-teal-500'
                }`}
              >
                {breathingActive ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>{copy.pauseBreathing}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>{copy.startBreathing}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setBreathingActive(false);
                  setBreathSeconds(0);
                }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 2: 5 GUIDED MEDITATION & CALM VIDEOS (INTERACTIVE VIDEO PLAYER)
      ===================================================================== */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-teal-700" />
              <h3 className={`font-semibold text-slate-900 ${seniorMode ? 'text-xl' : 'text-lg'}`}>
                {copy.videosHeading}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{copy.videosSub}</p>
          </div>

          {/* Player Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs self-start">
            <button
              type="button"
              onClick={() => setVideoPlayerMode('guided_visual')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                videoPlayerMode === 'guided_visual'
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              {copy.visualModeBtn}
            </button>
            <button
              type="button"
              onClick={() => setVideoPlayerMode('youtube_embed')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                videoPlayerMode === 'youtube_embed'
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              {copy.youtubeModeBtn}
            </button>
          </div>
        </div>

        {/* 5 Video Selector Cards + Active Video Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 5 Cols: List of 5 Meditation Videos */}
          <div className="lg:col-span-5 space-y-2.5">
            {MEDITATION_VIDEOS.map((vid) => {
              const isSelected = vid.id === selectedVideo.id;
              return (
                <div
                  key={vid.id}
                  onClick={() => {
                    setSelectedVideoId(vid.id);
                    setIsVisualSessionPlaying(true);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'border-2 border-teal-700 bg-teal-50/50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-mono font-bold text-teal-800">
                      VIDEO {vid.num} · {vid.duration}
                    </span>
                    <span className="text-slate-500 font-medium">{vid.focusTag[language]}</span>
                  </div>
                  <h4
                    className={`font-semibold text-slate-900 ${
                      seniorMode ? 'text-base' : 'text-sm'
                    }`}
                  >
                    {vid.title[language]}
                  </h4>
                  <p className="text-xs text-slate-600">{vid.instructor[language]}</p>
                </div>
              );
            })}
          </div>

          {/* Right 7 Cols: Active Video Player & Guided Steps */}
          <div className="lg:col-span-7 space-y-4">
            {/* Language-Specific YouTube Audio Bar */}
            <div className="p-3 rounded-xl bg-teal-50/80 border border-teal-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-teal-800 text-white font-mono font-semibold">
                  YouTube {youtubeAudioLang === 'hi' ? 'हिंदी' : youtubeAudioLang === 'mr' ? 'मराठी' : 'EN'}
                </span>
                <span className="font-semibold text-teal-950">
                  {selectedVideo.youtubeChannelLabel[youtubeAudioLang]}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-600 font-medium">
                  {language === 'mr'
                    ? 'YouTube भाषा:'
                    : language === 'hi'
                    ? 'YouTube भाषा:'
                    : 'YouTube Language:'}
                </span>
                {(
                  [
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'हिंदी' },
                    { code: 'mr', label: 'मराठी' },
                  ] as { code: Language; label: string }[]
                ).map((langOpt) => (
                  <button
                    key={langOpt.code}
                    type="button"
                    onClick={() => {
                      setYoutubeAudioLang(langOpt.code);
                      setVideoPlayerMode('youtube_embed');
                    }}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      youtubeAudioLang === langOpt.code
                        ? 'bg-teal-700 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {langOpt.label}
                  </button>
                ))}
              </div>
            </div>

            {videoPlayerMode === 'youtube_embed' ? (
              <div className="space-y-2">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-300 relative">
                  <iframe
                    key={`${selectedVideo.id}_${youtubeAudioLang}_${selectedVideo.youtubeEmbedId[youtubeAudioLang]}`}
                    src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeEmbedId[youtubeAudioLang]}?rel=0&modestbranding=1`}
                    title={selectedVideo.title[youtubeAudioLang]}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-600">
                  <span>
                    {youtubeAudioLang === 'mr'
                      ? `मराठी YouTube ध्यान व्हिडिओ: ${selectedVideo.title.mr}`
                      : youtubeAudioLang === 'hi'
                      ? `हिंदी YouTube ध्यान वीडियो: ${selectedVideo.title.hi}`
                      : `English YouTube Guided Meditation: ${selectedVideo.title.en}`}
                  </span>
                  <a
                    href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeEmbedId[youtubeAudioLang]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-teal-800 hover:underline"
                  >
                    {youtubeAudioLang === 'mr'
                      ? 'YouTube वर पूर्ण व्हिडिओ पहा ↗'
                      : youtubeAudioLang === 'hi'
                      ? 'YouTube पर पूरा वीडियो देखें ↗'
                      : 'Watch Directly on YouTube ↗'}
                  </a>
                </div>
              </div>
            ) : (
              /* Interactive Guided Visual Meditation Video Stage (Always works smoothly inside any browser/iframe) */
              <div
                className={`aspect-video w-full rounded-xl overflow-hidden bg-gradient-to-br ${selectedVideo.themeGradient} text-white p-6 flex flex-col justify-between relative border border-slate-300`}
              >
                <div className="flex items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-2 text-xs font-mono text-teal-200">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>
                      VIDEO {selectedVideo.num} · {selectedVideo.duration}
                    </span>
                  </div>
                  <span className="text-xs text-teal-100 font-medium">
                    {selectedVideo.focusTag[language]}
                  </span>
                </div>

                {/* Center Animated Mindfulness Visualizer */}
                <div className="my-auto flex flex-col items-center justify-center text-center space-y-3 py-4 z-10">
                  <div
                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-teal-300/60 bg-white/10 backdrop-blur-xs flex flex-col items-center justify-center p-3 transition-transform duration-1000 ${
                      isVisualSessionPlaying ? 'scale-105 animate-pulse' : 'scale-95 opacity-80'
                    }`}
                  >
                    <Sparkles className="w-7 h-7 text-teal-200 mb-1" />
                    <span className="text-[11px] font-semibold text-teal-100">
                      {isVisualSessionPlaying
                        ? language === 'mr'
                          ? 'शांत श्वास घ्या...'
                          : language === 'hi'
                          ? 'शांत श्वास लें...'
                          : 'Breathe in Peace...'
                        : language === 'mr'
                        ? 'सत्र थांबवले'
                        : language === 'hi'
                        ? 'सत्र रुका है'
                        : 'Session Paused'}
                    </span>
                  </div>

                  <div className="max-w-lg space-y-1">
                    <h4 className="font-display font-semibold text-base sm:text-lg text-white">
                      {selectedVideo.title[language]}
                    </h4>
                    <p className="text-xs text-teal-100/90 leading-relaxed">
                      {selectedVideo.description[language]}
                    </p>
                  </div>
                </div>

                {/* Video Player Bottom Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/15 z-10">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const nextState = !isVisualSessionPlaying;
                        setIsVisualSessionPlaying(nextState);
                        if (nextState) {
                          onSpeakText(selectedVideo.voiceNarration[language]);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold cursor-pointer"
                    >
                      {isVisualSessionPlaying ? (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>
                            {language === 'mr'
                              ? 'महिला आवाजात मार्गदर्शन ऐका'
                              : language === 'hi'
                              ? 'महिला आवाज में ध्यान सुनें'
                              : 'Play Voice-Guided Session'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Resume Session</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTogglePlaySong(MEDITATION_SONGS[0])}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold cursor-pointer"
                    >
                      <Music className="w-3.5 h-3.5 text-teal-200" />
                      <span>
                        {isPlayingSong ? 'Stop Background Music' : '+ Background Calm Music'}
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setVideoPlayerMode('youtube_embed')}
                    className="text-xs text-teal-200 hover:underline cursor-pointer"
                  >
                    Switch to YouTube Embed →
                  </button>
                </div>
              </div>
            )}

            {/* Guided Step-by-Step Instructions for Selected Video */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-700" />
                  <span>
                    {language === 'mr'
                      ? 'या ध्यान सत्राच्या ४ सोप्या पायऱ्या:'
                      : language === 'hi'
                      ? 'इस ध्यान सत्र के 4 सरल चरण:'
                      : 'Step-by-Step Practice Guide for This Video:'}
                  </span>
                </h4>
                <button
                  type="button"
                  onClick={() => onSpeakText(selectedVideo.voiceNarration[language])}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:underline cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{copy.listenVoiceGuide}</span>
                </button>
              </div>

              <ol
                className={`space-y-2 text-slate-700 list-decimal list-inside ${
                  seniorMode ? 'text-base' : 'text-xs sm:text-sm'
                }`}
              >
                {selectedVideo.guidedSteps[language].map((step, i) => (
                  <li key={i} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 3: 5 SOOTHING MEDITATION SONGS FOR A CALM & HAPPY ENVIRONMENT
      ===================================================================== */}
      <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-teal-700" />
              <h3 className={`font-semibold text-slate-900 ${seniorMode ? 'text-xl' : 'text-lg'}`}>
                {copy.songsHeading}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{copy.songsSub}</p>
          </div>
        </div>

        {/* Master Meditation Audio Console Deck */}
        <div
          className={`p-5 rounded-xl border transition-all ${
            isPlayingSong
              ? 'bg-teal-950 text-white border-teal-700 shadow-md'
              : 'bg-slate-900 text-white border-slate-800'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <button
                type="button"
                onClick={() => handleTogglePlaySong(activeSong)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  isPlayingSong
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    : 'bg-teal-600 text-white hover:bg-teal-500'
                }`}
              >
                {isPlayingSong ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-teal-300">
                  <span>{isPlayingSong ? copy.nowPlaying : copy.pausedAudio}</span>
                  <span>·</span>
                  <span>{activeSong.frequencyLabel}</span>
                  {isPlayingSong && (
                    <>
                      <span>·</span>
                      <span className="text-emerald-300 font-bold">
                        {formatMinutesSeconds(songElapsedSec)}
                      </span>
                    </>
                  )}
                </div>
                <h4 className="font-display font-semibold text-base sm:text-lg text-white">
                  {activeSong.num}. {activeSong.title[language]}
                </h4>
                <p className="text-xs text-slate-300">{activeSong.subtitle[language]}</p>
              </div>
            </div>

            {/* Playback Transport + Volume + Auto-Off Sleep Timer */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSkipSong(-1)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  title="Previous Meditation Song"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleTogglePlaySong(activeSong)}
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold cursor-pointer"
                >
                  {isPlayingSong ? 'Pause Music' : 'Play Music'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSkipSong(1)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  title="Next Meditation Song"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-lg text-xs">
                {songVolume === 0 ? (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-teal-300" />
                )}
                <span className="text-slate-300">{copy.volumeLabel}</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={songVolume}
                  onChange={(e) => setSongVolume(Number(e.target.value))}
                  className="w-20 accent-teal-400 cursor-pointer"
                />
              </div>

              {/* Auto-Off Sleep Timer */}
              <div className="flex items-center gap-1.5 bg-slate-800/90 px-3 py-1.5 rounded-lg text-xs">
                <Clock className="w-3.5 h-3.5 text-teal-300" />
                <span className="text-slate-300">{copy.sleepTimerLabel}</span>
                {[null, 5, 15, 30].map((mins) => (
                  <button
                    key={String(mins)}
                    type="button"
                    onClick={() => setSleepTimerMin(mins)}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] cursor-pointer ${
                      sleepTimerMin === mins
                        ? 'bg-teal-600 text-white font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {mins === null ? 'Off' : `${mins}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5 Meditation Songs Tracklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {MEDITATION_SONGS.map((song) => {
            const isThisPlaying = isPlayingSong && activeSongId === song.id;
            const isSelected = activeSongId === song.id;

            return (
              <div
                key={song.id}
                onClick={() => handleTogglePlaySong(song)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isThisPlaying
                    ? 'border-2 border-teal-700 bg-teal-50/70 shadow-xs'
                    : isSelected
                    ? 'border-teal-600/60 bg-slate-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-teal-800">SONG {song.num}</span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {song.frequencyLabel}
                    </span>
                  </div>

                  <h4
                    className={`font-semibold text-slate-900 leading-snug ${
                      seniorMode ? 'text-base' : 'text-sm'
                    }`}
                  >
                    {song.title[language]}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {song.subtitle[language]}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-200/70">
                  <p className="text-[11px] text-teal-900 font-medium">
                    {song.moodBenefit[language]}
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePlaySong(song);
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isThisPlaying
                        ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                        : 'bg-teal-700 text-white hover:bg-teal-800'
                    }`}
                  >
                    {isThisPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>
                          {language === 'mr'
                            ? 'सुरू आहे (थांबवा)'
                            : language === 'hi'
                            ? 'बज रहा है (रोकें)'
                            : 'Playing (Pause)'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>
                          {language === 'mr'
                            ? 'शांत गीत ऐका'
                            : language === 'hi'
                            ? 'शांत गीत सुनें'
                            : 'Play Calm Song'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
