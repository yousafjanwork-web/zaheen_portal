import React, { useState, useRef } from 'react';
import {
  Mic,
  Square,
  Play,
  Upload,
  Trash2,
  Check,
  Volume2,
  Sparkles,
  Info,
  RotateCcw,
  Loader2,
  Wand2,
  RefreshCw,
  Camera,
} from 'lucide-react';
import { QuizQuestion, SubjectId } from '../data/quizData';
import { ALL_STUDIO_QUESTIONS } from '../data/allStudioQuestions';
import {
  CustomMediaItem,
  saveCustomMedia,
  deleteCustomMedia,
  clearAllCustomMedia,
} from '../data/customMediaStorage';
import { ItemIllustration } from './illustrations/ItemIllustration';
import { sounds } from '../utils/audio';
import { generateGeminiVoice, generateGeminiImage } from '../utils/geminiAi';

interface ParentMediaStudioProps {
  customMediaMap: Record<string, CustomMediaItem>;
  onMediaUpdated: () => void;
  onClose: () => void;
}

export const ParentMediaStudio: React.FC<ParentMediaStudioProps> = ({
  customMediaMap,
  onMediaUpdated,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'studio' | 'ai-studio' | 'guide'>('studio');
  const [filterSubject, setFilterSubject] = useState<SubjectId | 'all'>('all');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(ALL_STUDIO_QUESTIONS[0].id);

  // Selected realistic female voice option
  const [selectedVoice, setSelectedVoice] = useState<'Kore' | 'Aoede'>('Kore');

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  // AI Loading States
  const [isGeneratingAiVoice, setIsGeneratingAiVoice] = useState(false);
  const [isGeneratingAiImage, setIsGeneratingAiImage] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Batch Generation State
  const [batchProgress, setBatchProgress] = useState<{
    running: boolean;
    current: number;
    total: number;
    statusText: string;
  }>({ running: false, current: 0, total: 0, statusText: '' });

  // Filtered Questions
  const filteredQuestions = ALL_STUDIO_QUESTIONS.filter((q) => {
    if (filterSubject === 'all') return true;
    return q.subject === filterSubject;
  });

  const activeQuestion =
    ALL_STUDIO_QUESTIONS.find((q) => q.id === selectedQuestionId) || ALL_STUDIO_QUESTIONS[0];
  const activeCustomData = customMediaMap[activeQuestion.id];

  // Start Mic Recording
  const startRecording = async () => {
    sounds.playPop();
    setAiError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          await saveCustomMedia(activeQuestion.id, {
            title: activeQuestion.prompt,
            customAudioUrl: base64Audio,
            customImageUrl: activeCustomData?.customImageUrl,
          });
          onMediaUpdated();
          sounds.playStarEarn();
        };

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordingDuration(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch {
      alert('Microphone access was denied. Please allow microphone permissions in your browser.');
    }
  };

  // Stop Mic Recording
  const stopRecording = () => {
    sounds.playPop();
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Play Current Voice
  const playCurrentVoice = () => {
    sounds.playPop();
    if (activeCustomData?.customAudioUrl) {
      sounds.playCustomAudio(activeCustomData.customAudioUrl);
    } else {
      sounds.speak(activeQuestion.speechText, activeQuestion.speechLang);
    }
  };

  // ----------------------------------------------------
  // GEMINI AI VOICE GENERATION (REALISTIC FEMALE VOICE)
  // ----------------------------------------------------
  const handleGenerateGeminiVoiceForCurrent = async () => {
    sounds.playPop();
    setIsGeneratingAiVoice(true);
    setAiError(null);

    const result = await generateGeminiVoice(
      activeQuestion.speechText,
      activeQuestion.speechLang,
      selectedVoice
    );

    setIsGeneratingAiVoice(false);

    if (result.success && result.audioUrl) {
      await saveCustomMedia(activeQuestion.id, {
        title: activeQuestion.prompt,
        customAudioUrl: result.audioUrl,
        customImageUrl: activeCustomData?.customImageUrl,
      });
      onMediaUpdated();
      sounds.playStarEarn();
      // Instantly audition the generated voice
      sounds.playCustomAudio(result.audioUrl);
    } else {
      setAiError(result.error || 'Failed to generate voice speech.');
      sounds.playGentleTryAgain();
    }
  };

  // ----------------------------------------------------
  // GEMINI AI IMAGE GENERATION
  // ----------------------------------------------------
  const handleGenerateGeminiImageForCurrent = async () => {
    sounds.playPop();
    setIsGeneratingAiImage(true);
    setAiError(null);

    const promptBase =
      activeQuestion.featuredIllustration ||
      (activeQuestion.subject === 'urdu' ? activeQuestion.promptUrdu || activeQuestion.prompt : activeQuestion.prompt);

    const result = await generateGeminiImage(promptBase, activeQuestion.subject);

    setIsGeneratingAiImage(false);

    if (result.success && result.imageUrl) {
      await saveCustomMedia(activeQuestion.id, {
        title: activeQuestion.prompt,
        customImageUrl: result.imageUrl,
        customAudioUrl: activeCustomData?.customAudioUrl,
      });
      onMediaUpdated();
      sounds.playStarEarn();
    } else {
      setAiError(result.error || 'Failed to generate image. Please try again or upload a photo.');
      sounds.playGentleTryAgain();
    }
  };

  // ----------------------------------------------------
  // BATCH GENERATE VOICES FOR SUBJECT
  // ----------------------------------------------------
  const handleBatchGenerateVoices = async (subj: SubjectId) => {
    sounds.playPop();
    const questionsToProcess = ALL_STUDIO_QUESTIONS.filter((q) => q.subject === subj);

    setBatchProgress({
      running: true,
      current: 0,
      total: questionsToProcess.length,
      statusText: `Starting AI voice generation for ${subj.toUpperCase()}...`,
    });

    for (let i = 0; i < questionsToProcess.length; i++) {
      const q = questionsToProcess[i];
      setBatchProgress((prev) => ({
        ...prev,
        current: i + 1,
        statusText: `Generating voice ${i + 1} of ${questionsToProcess.length} (${q.speechText.slice(0, 24)}...)...`,
      }));

      const res = await generateGeminiVoice(q.speechText, q.speechLang, selectedVoice);

      if (res.success && res.audioUrl) {
        const existing = customMediaMap[q.id];
        await saveCustomMedia(q.id, {
          title: q.prompt,
          customAudioUrl: res.audioUrl,
          customImageUrl: existing?.customImageUrl,
        });
      }
    }

    setBatchProgress({
      running: false,
      current: questionsToProcess.length,
      total: questionsToProcess.length,
      statusText: `Done! All ${subj} realistic female voices created! 🎉`,
    });

    onMediaUpdated();
    sounds.playFanfare();
  };

  // Upload Custom Photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playPop();
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target?.result as string;
      await saveCustomMedia(activeQuestion.id, {
        title: activeQuestion.prompt,
        customImageUrl: base64Image,
        customAudioUrl: activeCustomData?.customAudioUrl,
      });
      onMediaUpdated();
      sounds.playStarEarn();
    };
    reader.readAsDataURL(file);
  };

  // Upload Custom Audio File (.mp3 / .wav)
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playPop();
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Audio = event.target?.result as string;
      await saveCustomMedia(activeQuestion.id, {
        title: activeQuestion.prompt,
        customAudioUrl: base64Audio,
        customImageUrl: activeCustomData?.customImageUrl,
      });
      onMediaUpdated();
      sounds.playStarEarn();
    };
    reader.readAsDataURL(file);
  };

  // Reset current question media
  const handleResetCurrent = async () => {
    sounds.playPop();
    await deleteCustomMedia(activeQuestion.id);
    onMediaUpdated();
  };

  // Reset all media
  const handleResetAll = async () => {
    if (confirm('Are you sure you want to restore all default images and voices?')) {
      sounds.playPop();
      await clearAllCustomMedia();
      onMediaUpdated();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl max-w-4xl w-full h-[90vh] max-h-[850px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-200 bg-amber-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-950 fill-amber-950" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-fun">
                Custom Media & Gemini AI Studio 🎙️✨
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Realistic female voices for English & Urdu + bespoke kindergarten imagery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex bg-white p-1 rounded-xl border border-amber-200 text-xs font-bold">
              <button
                onClick={() => {
                  sounds.playPop();
                  setActiveTab('studio');
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'studio' ? 'bg-amber-400 text-amber-950 shadow-sm' : 'text-slate-600'
                }`}
              >
                Media Studio
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setActiveTab('ai-studio');
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'ai-studio' ? 'bg-amber-400 text-amber-950 shadow-sm' : 'text-slate-600'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-rose-500" />
                <span>AI Batch Studio</span>
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setActiveTab('guide');
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'guide' ? 'bg-amber-400 text-amber-950 shadow-sm' : 'text-slate-600'
                }`}
              >
                Guide
              </button>
            </div>

            <button
              onClick={() => {
                sounds.playPop();
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: AI BATCH STUDIO */}
          {activeTab === 'ai-studio' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border-2 border-rose-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-lg">
                  <Wand2 className="w-5 h-5 text-rose-500" />
                  <span>Google Gemini Realistic Female Voice Engine</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Generate realistic, warm female voice narrations with clear pronunciation for all English and Urdu quizzes at once using the Google Gemini TTS model.
                </p>

                {/* Voice Profile Selector */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-slate-600">Select Female Voice:</span>
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setSelectedVoice('Kore');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 cursor-pointer transition-all ${
                      selectedVoice === 'Kore'
                        ? 'bg-rose-500 border-rose-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    👩 Kore (Warm Kindergarten Teacher) ★
                  </button>
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setSelectedVoice('Aoede');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 cursor-pointer transition-all ${
                      selectedVoice === 'Aoede'
                        ? 'bg-rose-500 border-rose-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    👩 Aoede (Melodious Storyteller)
                  </button>
                </div>
              </div>

              {/* Batch Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* English Batch */}
                <div className="p-5 rounded-2xl bg-white border-2 border-sky-200 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-base">English Quizzes</span>
                    <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                      15 Questions
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Generates clear, expressive female English phonics and letter questions.
                  </p>
                  <button
                    disabled={batchProgress.running}
                    onClick={() => handleBatchGenerateVoices('english')}
                    className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer text-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate All English Voices</span>
                  </button>
                </div>

                {/* Urdu Batch */}
                <div className="p-5 rounded-2xl bg-white border-2 border-rose-200 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-base font-urdu">اردو کوئز</span>
                    <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                      15 سوالات
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Generates melodious female Urdu pronunciations for حروفِ تہجی and picture matching.
                  </p>
                  <button
                    disabled={batchProgress.running}
                    onClick={() => handleBatchGenerateVoices('urdu')}
                    className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer text-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate All Urdu Voices</span>
                  </button>
                </div>
              </div>

              {/* Progress Display */}
              {batchProgress.running && (
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                    <span>{batchProgress.statusText}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-2.5 rounded-full transition-all duration-300"
                      style={{
                        width: `${(batchProgress.current / batchProgress.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {batchProgress.statusText && !batchProgress.running && (
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 font-bold text-sm text-center">
                  {batchProgress.statusText}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-amber-950 text-lg">
                  <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400" />
                  <span>Using Custom Media & Google Gemini AI</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Zaheen gives you complete freedom: you can generate realistic female voices and storybook images with **Google Gemini API**, record your **own microphone voice**, or upload **real photos** from your phone or PC!
                </p>
              </div>

              {/* Method 1 */}
              <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                  <span className="w-6 h-6 rounded-full bg-rose-400 text-white text-xs flex items-center justify-center font-bold">1</span>
                  <span>Google Gemini Realistic Female Voices (English & Urdu)</span>
                </div>
                <p className="text-sm text-slate-600">
                  Powered by Gemini's TTS model using prebuilt female voice personas <strong>Kore</strong> and <strong>Aoede</strong>.
                </p>
                <ul className="text-sm text-slate-600 list-disc list-inside space-y-1.5 pl-2">
                  <li><strong>English Phonics:</strong> Speaks letters and phonics with warm kindergarten enthusiasm.</li>
                  <li><strong>Urdu Huroof:</strong> Pronounces Urdu letters (الف، بے، پے، تے، ٹے) and familiar words (ت سے تتلی، ب سے بلی) clearly and melodiously.</li>
                  <li>Click <em>"✨ Generate Realistic Female Voice (Gemini AI)"</em> on any question, or use the <em>"AI Batch Studio"</em> to generate all 15 questions in one click!</li>
                </ul>
              </div>

              {/* Method 2 */}
              <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                  <span className="w-6 h-6 rounded-full bg-sky-400 text-white text-xs flex items-center justify-center font-bold">2</span>
                  <span>Google Gemini Custom Images</span>
                </div>
                <p className="text-sm text-slate-600">
                  Click <em>"✨ Generate with Gemini AI"</em> under the image section. Gemini generates a bespoke, colorful kindergarten cartoon drawing for that question item.
                </p>
              </div>

              {/* Method 3 */}
              <div className="p-5 rounded-2xl bg-white border-2 border-slate-200 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 text-xs flex items-center justify-center font-bold">3</span>
                  <span>Your Own Voice & Real Photos</span>
                </div>
                <p className="text-sm text-slate-600">
                  Tap <em>"Record Mic"</em> to record Mom, Dad, or Teacher's live voice, or click <em>"Choose Photo"</em> to upload photos of your real cat, toys, or drawings.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA STUDIO PER QUESTION */}
          {activeTab === 'studio' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Question Picker */}
              <div className="md:col-span-5 space-y-3 border-r-0 md:border-r border-slate-200 pr-0 md:pr-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Filter by Subject:</span>
                  <div className="flex gap-1 text-xs">
                    {(['all', 'english', 'urdu', 'maths'] as const).map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          sounds.playPop();
                          setFilterSubject(sub);
                        }}
                        className={`px-2 py-1 rounded-lg capitalize cursor-pointer font-bold ${
                          filterSubject === sub
                            ? 'bg-amber-400 text-amber-950 shadow-sm'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
                  {filteredQuestions.map((q) => {
                    const isSelected = q.id === selectedQuestionId;
                    const hasCustom = !!customMediaMap[q.id];

                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          sounds.playPop();
                          setSelectedQuestionId(q.id);
                          setAiError(null);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between gap-2 border-2 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 border-amber-400 shadow-sm'
                            : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {q.subject === 'urdu' ? (q.promptUrdu || q.prompt) : q.prompt}
                          </div>
                          <div className="text-[11px] text-slate-400 capitalize">
                            {q.subject} · {q.activityType}
                          </div>
                        </div>

                        {hasCustom && (
                          <span className="shrink-0 text-xs bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md">
                            Custom ★
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Customizer Controls for Selected Question */}
              <div className="md:col-span-7 space-y-6">
                <div className="p-4 rounded-2xl bg-amber-50/60 border-2 border-amber-200 space-y-2">
                  <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    Selected Question ({activeQuestion.subject.toUpperCase()})
                  </div>
                  <h3
                    className={`text-lg font-bold text-slate-900 ${
                      activeQuestion.subject === 'urdu' ? 'font-urdu' : ''
                    }`}
                  >
                    {activeQuestion.subject === 'urdu'
                      ? (activeQuestion.promptUrdu || activeQuestion.prompt)
                      : activeQuestion.prompt}
                  </h3>
                  <div className="text-xs text-slate-600 font-medium bg-white/70 p-2 rounded-xl border border-amber-200">
                    Spoken Prompt: <span className="font-bold text-slate-900">"{activeQuestion.speechText}"</span>
                  </div>
                </div>

                {/* Error Banner */}
                {aiError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-medium">
                    ⚠️ {aiError}
                  </div>
                )}

                {/* Section A: Voice Customization (Gemini AI + Mic) */}
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-rose-500" />
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        Voice Speech (Female Gemini AI or Mic)
                      </span>
                    </div>

                    {activeCustomData?.customAudioUrl && (
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Voice Active
                      </span>
                    )}
                  </div>

                  {/* Gemini AI Voice Generator Button */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-900">
                        ✨ Realistic Female Voice (Google Gemini):
                      </span>
                      <select
                        value={selectedVoice}
                        onChange={(e) => setSelectedVoice(e.target.value as 'Kore' | 'Aoede')}
                        className="text-xs font-bold bg-white border border-rose-300 rounded-lg px-2 py-1 text-slate-700"
                      >
                        <option value="Kore">Kore (Warm Teacher)</option>
                        <option value="Aoede">Aoede (Melodious)</option>
                      </select>
                    </div>

                    <button
                      disabled={isGeneratingAiVoice}
                      onClick={handleGenerateGeminiVoiceForCurrent}
                      className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer text-sm"
                    >
                      {isGeneratingAiVoice ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Generating Female Voice with Gemini...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Generate Voice with Gemini AI ({selectedVoice})</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Manual Mic Recording & File Upload Controls */}
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-sm transition-transform active:scale-95 cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5 text-rose-400" />
                        <span>Record Mic</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="inline-flex items-center gap-1.5 bg-rose-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-md animate-pulse cursor-pointer"
                      >
                        <Square className="w-3.5 h-3.5 fill-white" />
                        <span>Stop Mic ({recordingDuration}s)</span>
                      </button>
                    )}

                    {/* Preview Voice Button */}
                    <button
                      onClick={playCurrentVoice}
                      className="inline-flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold px-3 py-2 rounded-xl border border-amber-300 transition-colors cursor-pointer text-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-amber-950" />
                      <span>{activeCustomData?.customAudioUrl ? 'Listen to Current Voice' : 'Hear Default Audio'}</span>
                    </button>

                    {/* File Upload Option */}
                    <label className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-2 rounded-xl border border-slate-300 text-xs transition-colors cursor-pointer">
                      <Upload className="w-3 h-3" />
                      <span>Upload MP3/WAV</span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Section B: Custom Image / Photo (Gemini AI + Camera/File) */}
                <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-sky-500" />
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        Image / Visual (Gemini AI or Photo)
                      </span>
                    </div>

                    {activeCustomData?.customImageUrl && (
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Custom Image Active
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Image Preview Box */}
                    <div className="w-20 h-20 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center p-2 overflow-hidden shadow-inner shrink-0">
                      {activeCustomData?.customImageUrl ? (
                        <img
                          src={activeCustomData.customImageUrl}
                          alt="Custom upload"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : activeQuestion.featuredIllustration ? (
                        <ItemIllustration id={activeQuestion.featuredIllustration} size="md" />
                      ) : (
                        <span className="text-2xl font-bold text-amber-900">
                          {activeQuestion.featuredLetter || activeQuestion.featuredNumber || '★'}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 flex-1">
                      {/* Gemini AI Image Button */}
                      <button
                        disabled={isGeneratingAiImage}
                        onClick={handleGenerateGeminiImageForCurrent}
                        className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold py-2 px-3 rounded-xl shadow-sm text-xs transition-transform active:scale-95 cursor-pointer"
                      >
                        {isGeneratingAiImage ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Generating Image with Gemini...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Generate Cartoon Image with Gemini AI</span>
                          </>
                        )}
                      </button>

                      {/* Photo Upload Button */}
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl border border-slate-300 text-xs transition-colors cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>Upload Real Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-slate-500">
                          (Camera photo, pet, or drawing)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reset Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleResetCurrent}
                    disabled={!activeCustomData}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 disabled:opacity-40 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Default for this Question</span>
                  </button>

                  <button
                    onClick={handleResetAll}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset All Custom Media</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>💡 Generated Gemini voices and custom images save automatically to your browser for Zaheen's quizzes.</span>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2 rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
