import React from 'react';
import { Sparkles, Play, Volume2, BookOpen, Heart, ArrowRight, Mic, Camera } from 'lucide-react';
import { SubjectId, ActivityTypeId } from '../data/quizData';
import { sounds } from '../utils/audio';
import { getHardcodedAudio } from '../data/hardcodedMedia';

// Generated assets
import mascotWelcomeImg from '../assets/images/zaheen_mascot_welcome_1790533242599.jpg';
import englishImg from '../assets/images/zaheen_english_adventure_1790533258018.jpg';
import urduImg from '../assets/images/zaheen_urdu_garden_1790533270040.jpg';
import mathsImg from '../assets/images/zaheen_maths_playground_1790533282644.jpg';

interface HomeScreenProps {
  onSelectSubject: (subject: SubjectId) => void;
  onLaunchActivity: (activity: ActivityTypeId) => void;
  onViewStickers: () => void;
  onOpenMediaStudio: () => void;
  totalStars: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectSubject,
  onLaunchActivity,
  onViewStickers,
  onOpenMediaStudio,
  totalStars,
}) => {
  const speakWelcome = () => {
    sounds.playPop();
    sounds.playCustomAudio(getHardcodedAudio('welcome-home'), "Welcome to Zaheen! Pick English, Urdu, or Maths to start playing!", 'en');
  };

  const handleSubjectClick = (subj: SubjectId) => {
    sounds.playPop();
    onSelectSubject(subj);
  };

  const handleQuickPlay = (act: ActivityTypeId) => {
    sounds.playPop();
    onLaunchActivity(act);
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-orange-300 to-amber-300 p-6 sm:p-10 shadow-lg border-4 border-amber-200">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/90 text-amber-900 px-3.5 py-1.5 rounded-full font-bold text-sm sm:text-base shadow-sm border border-amber-300">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>Kindergarten Quiz Adventure</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Hello, <span className="text-amber-950 underline decoration-amber-500 decoration-wavy">Zaheen</span>! 🌟
            </h1>

            <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed max-w-xl">
              Are you ready to explore letters, sounds, friendly numbers, and colorful Urdu words? Let's have fun together!
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={speakWelcome}
                className="inline-flex items-center gap-2 bg-white hover:bg-amber-50 text-slate-800 font-bold px-4 py-3 rounded-2xl shadow-md border-2 border-amber-300 text-base sm:text-lg transition-transform active:scale-95 cursor-pointer"
                title="Listen to Welcome"
              >
                <Volume2 className="w-5 h-5 text-amber-600" />
                <span>Hear Voice</span>
              </button>

              <button
                onClick={() => handleQuickPlay('math-count')}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-2xl shadow-lg border-2 border-slate-900 text-base sm:text-lg transition-transform active:scale-95 cursor-pointer"
              >
                <Play className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                <span>Quick Play</span>
              </button>

              {/* <button
                onClick={onViewStickers}
                className="inline-flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold px-4 py-3 rounded-2xl border-2 border-purple-300 text-base sm:text-lg transition-transform active:scale-95 cursor-pointer"
              >
                <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                <span>{totalStars} Stars Earned</span>
              </button> */}
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-2 bg-amber-400/40 rounded-3xl blur-lg group-hover:blur-xl transition-all" />
              <div className="relative overflow-hidden rounded-3xl shadow-xl border-4 border-white aspect-[16/9] transition-transform group-hover:scale-102">
                <img
                  src={mascotWelcomeImg}
                  alt="Zaheen Learning Mascot Baby Elephant waving with balloons"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
                  🐘 Zaheen Mascot (Friendly Baby Elephant)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subject Selection Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Choose Your Subject
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Tap a colorful card below to practice English, Urdu, or Maths!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: English */}
          <div className="group flex flex-col bg-white rounded-3xl border-4 border-sky-300 shadow-md hover:shadow-xl hover:border-sky-400 transition-all overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden bg-sky-100">
              <img
                src={englishImg}
                alt="English alphabet learning blocks and cute animals"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-sky-600 text-white font-bold text-xs sm:text-sm px-3 py-1 rounded-full shadow-md">
                English
              </div>
              <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
                ABC Blocks, Apple & Duck
              </div>
            </div>

            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">
                  English Fun
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-medium">
                  Practice ABC letter recognition, phonics sounds, and simple words with friendly illustrations!
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5 text-xs text-slate-500 font-semibold">
                  <span>Letters</span>
                  <span aria-hidden="true">·</span>
                  <span>Phonics /æ/ /k/</span>
                  <span aria-hidden="true">·</span>
                  <span>Simple Words</span>
                </div>

                <button
                  onClick={() => handleSubjectClick('english')}
                  className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md text-base sm:text-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <span>Play English</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Urdu */}
          <div className="group flex flex-col bg-white rounded-3xl border-4 border-rose-300 shadow-md hover:shadow-xl hover:border-rose-400 transition-all overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden bg-rose-100">
              <img
                src={urduImg}
                alt="Urdu huroof garden with butterfly and crescent moon"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 right-3 bg-rose-600 text-white font-bold text-sm sm:text-base px-3 py-1 rounded-full shadow-md font-urdu">
                اردو زبان
              </div>
              <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs shadow-xs font-urdu">
                پیاری تتلی اور چاند (Butterfly & Moon)
              </div>
            </div>

            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900 font-urdu leading-snug">
                  پیاری اردو
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-medium">
                  حروفِ تہجی کی پہچان، ب سے بلی، ت سے تتلی اور پیاری اردو آوازیں کھیلیں!
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5 text-xs text-slate-500 font-semibold font-urdu">
                  <span>حروفِ تہجی</span>
                  <span aria-hidden="true">·</span>
                  <span>تصویر اور حرف</span>
                  <span aria-hidden="true">·</span>
                  <span>آوازیں</span>
                </div>

                <button
                  onClick={() => handleSubjectClick('urdu')}
                  className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md text-base sm:text-lg font-urdu transition-transform active:scale-95 cursor-pointer"
                >
                  <span>اردو کھیلیں</span>
                  <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Maths */}
          <div className="group flex flex-col bg-white rounded-3xl border-4 border-emerald-300 shadow-md hover:shadow-xl hover:border-emerald-400 transition-all overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden bg-emerald-100">
              <img
                src={mathsImg}
                alt="Maths playground with numbers and friendly ducks"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-emerald-600 text-white font-bold text-xs sm:text-sm px-3 py-1 rounded-full shadow-md">
                1 2 3 Maths
              </div>
              <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
                Numbers 1 2 3 & Swimming Ducks
              </div>
            </div>

            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">
                  Maths Playground
                </h3>
                <p className="text-sm sm:text-base text-slate-600 font-medium">
                  Tap to count cute ducks and apples, recognize numbers 1 to 10, and do simple addition!
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5 text-xs text-slate-500 font-semibold">
                  <span>Tap & Count</span>
                  <span aria-hidden="true">·</span>
                  <span>Number Match</span>
                  <span aria-hidden="true">·</span>
                  <span>Simple 2+1</span>
                </div>

                <button
                  onClick={() => handleSubjectClick('maths')}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md text-base sm:text-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <span>Play Maths</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Launch Fun Activities */}
      <section className="bg-amber-100/60 rounded-3xl p-6 sm:p-8 border-2 border-amber-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Featured Kindergarten Quizzes
            </h3>
            <p className="text-sm text-slate-600 font-medium">
              Short, 5-question rounds with instant friendly feedback and zero timer pressure!
            </p>
          </div>
          {/* <button
            onClick={onViewStickers}
            className="self-start sm:self-auto text-sm font-bold text-purple-700 hover:text-purple-900 underline flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Check Zaheen's Stickers</span>
          </button> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <button
            onClick={() => handleQuickPlay('eng-letters')}
            className="flex items-center gap-3 p-3.5 bg-white hover:bg-sky-50 border-2 border-sky-200 hover:border-sky-400 rounded-2xl text-left transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xl shrink-0">
              A-Z
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">All 26 Letters</div>
              <div className="text-xs text-slate-500">English · A to Z Friends</div>
            </div>
          </button>

          <button
            onClick={() => handleQuickPlay('eng-phonics-test')}
            className="flex items-center gap-3 p-3.5 bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400 rounded-2xl text-left transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xl shrink-0">
              🎧
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Phonics Test ★</div>
              <div className="text-xs text-slate-500">Blends, Vowels, Rhymes</div>
            </div>
          </button>

          <button
            onClick={() => handleQuickPlay('ur-numbers')}
            className="flex items-center gap-3 p-3.5 bg-white hover:bg-teal-50 border-2 border-teal-200 hover:border-teal-400 rounded-2xl text-left transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl font-urdu shrink-0">
              ۱-۲۰
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm font-urdu">اردو گنتی (۱ تا ۲۰)</div>
              <div className="text-xs text-slate-500 font-urdu">ایک تا بیس ہندسے</div>
            </div>
          </button>

          <button
            onClick={() => handleQuickPlay('math-count')}
            className="flex items-center gap-3 p-3.5 bg-white hover:bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-400 rounded-2xl text-left transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0">
              1-20
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">Count Up to 20</div>
              <div className="text-xs text-slate-500">Maths · Tap to 20!</div>
            </div>
          </button>
        </div>
      </section>

      {/* Parent & Teacher Personalization Studio Banner */}
      <section className="hidden">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-300">
            <Mic className="w-3.5 h-3.5 text-rose-600" />
            <span>Parent & Teacher Studio</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            Use Your Own Voice & Real Family Photos!
          </h3>
          <p className="text-sm text-slate-600 font-medium max-w-xl">
            Make learning intimate and memorable. Record your voice speaking letters and Urdu sounds, or upload photos of your real pet, toys, and drawings.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playPop();
            onOpenMediaStudio();
          }}
          className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md text-base transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <Camera className="w-5 h-5" />
          <span>Open Media Studio</span>
        </button>
      </section>
    </div>
  );
};
