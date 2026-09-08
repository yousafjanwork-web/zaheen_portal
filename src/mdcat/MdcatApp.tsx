/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
 
import { useState, useEffect } from "react";
 
import { motion, AnimatePresence } from "motion/react";
import {
  PerformanceStats,
  StudyRecommendation,
  Quiz,
  MDCATSubject,
} from "./types";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";
 
import { mdcatApi } from "./config";
import Dashboard from "./components/Home";
import DashBoard1 from "./components/Dashboard";
import QuizSession from "./components/QuizSession";
import AIQuizGenerator from "./components/AIQuizGenerator";
import SolvedPaper from "./components/SolvedPapers";
import PastPapers from "./components/PastPapers";
const ZaheenLogo = "https://cdn.zaheen.com.pk/zaheen-web-img/ZaheenLogo.png";
// import FocusTimer from "./components/FocusTimer";
import StudyNotes from "./components/StudyNotes";
import FAQ from "./components/Faq";
import Footer from "./components/Footer";
import ProgressBar from "./components/ProgressBar";
import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import LoadingFrame from "./components/LoadingFrame";
import AiTutorPage from "./components/AiTutorPage";
import SEO from "./components/SEO";
import RepeatedQuestions from "./components/RepeatedQuestions";
import { MdcatAuthOverlayProvider, useMdcatAuthOverlay } from "./context/MdcatAuthOverlayContext";
import MdcatAuthOverlay from "./components/MdcatAuthOverlay";
 
// ─── Helper: map snake_case quiz fields from DB to camelCase for frontend ───
const mapQuiz = (q: any): Quiz => ({
  ...q,
  subTopic: q.subTopic ?? q.sub_topic ?? "",
  isAiGenerated: q.isAiGenerated ?? q.is_ai_generated === 1,
  isPastPaper: q.isPastPaper ?? q.is_past_paper === 1,
  pastPaperYear: q.pastPaperYear ?? q.past_paper_year ?? null,
  pastPaperRegion: q.pastPaperRegion ?? q.past_paper_region ?? null,
  createdAt: q.createdAt ?? q.created_at ?? null,
});
 
// ─── Helper: map snake_case question fields ───
const mapQuestion = (q: any) => ({
  ...q,
  questionText: q.questionText ?? q.question_text ?? "",
  optionA: q.optionA ?? q.option_a ?? "",
  optionB: q.optionB ?? q.option_b ?? "",
  optionC: q.optionC ?? q.option_c ?? "",
  optionD: q.optionD ?? q.option_d ?? "",
  correctOption: q.correctOption ?? q.correct_option ?? "A",
  subTopic: q.subTopic ?? q.sub_topic ?? "",
});
 
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      style={{ gridArea: "1 / 1" }}
      className="w-full min-w-0 h-full overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
 
function AIQuizRoute({ quiz, onAttemptFinished }: {
  quiz: Quiz | null;
  onAttemptFinished: (...args: any[]) => void;
 
}) {
  const navigate = useNavigate();
  if (!quiz) return <Navigate to="/mdcat/ai-prep" replace />;
  return (
    <QuizSession
      quiz={quiz}
      onBack={() => navigate("/mdcat/ai-prep")}
      onAttemptFinished={onAttemptFinished}
     
    />
  );
}
 
 function QuizSessionRoute({
 
  loading,
  onAttemptFinished,
 
}: {
  quizzes: Quiz[];
  loading: boolean;
  onAttemptFinished: (...args: any[]) => void;
 
}) {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [fullQuiz, setFullQuiz] = useState<Quiz | null>(null);
  const [fetchingQuiz, setFetchingQuiz] = useState(true);
 
  useEffect(() => {
    let cancelled = false;
    setFetchingQuiz(true);
 
    fetch(mdcatApi(`/api/mdcat/quizzes/${quizId}`))
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const raw = json.data ?? json;
        setFullQuiz({
          ...mapQuiz(raw),
          questions: (raw.questions || []).map(mapQuestion),
        });
      })
      .catch((e) => {
        console.error("Failed to load quiz", e);
        if (!cancelled) setFullQuiz(null);
      })
      .finally(() => {
        if (!cancelled) setFetchingQuiz(false);
      });
 
    return () => {
      cancelled = true;
    };
  }, [quizId]);
 
  if (loading || fetchingQuiz) {
    return <LoadingFrame />;
  }
 
  if (!fullQuiz) {
    return <Navigate to="/" replace />;
  }
 
  return (
    <QuizSession
      quiz={fullQuiz}
      onBack={() => navigate("/mdcat/past-papers")}
      onAttemptFinished={onAttemptFinished}
     
    />
  );
}
 
interface Question {
  quiz_id: 9999;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D";
  subTopic?: string;
  explanation?: string;
}
 
async function addNewAIQuestions(questions:Question[])
{
    const url = mdcatApi("/api/mdcat/quizzes/AddAIQuestions");
    try
    {
    const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ questions }), // wrap it to match req.body.questions
});
    if(!res.ok)
    {
      console.log(await res.json())
    }
    }
    catch(e)
    {
      alert("could not upload questions");
      console.log(e);
    }
 
 
   
 
 
}
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}
 
function MdcatAppInner() {
  const { isOpen } = useMdcatAuthOverlay();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "ai-generator" | "past-papers" | "notes" | "repeated-questions"
  >("dashboard");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [allRepeatedQuestions, setAllRepeatedQuestions] = useState<any[]>([]);
  const [repeatedVisibleCount, setRepeatedVisibleCount] = useState(20);
  const REPEATED_PAGE_SIZE = 20;

  const repeatedQuestions = allRepeatedQuestions.slice(0, repeatedVisibleCount);
  const repeatedHasMore = repeatedVisibleCount < allRepeatedQuestions.length;
  const repeatedLoading_more = false;
 
  const navigate = useNavigate();
  const location = useLocation();
 
  // Performance tracking states
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    totalAttempts: 0,
    averageScorePercent: 0,
    subjectBreakdown: [],
    subTopicList: [],
    attemptHistory: [],
  });
 
  // AI recommendations state
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>(
    [],
  );
 
  // UI state
  const [loading, setLoading] = useState(true);
  const [repeatedLoading,setRepeatedLoading] = useState(true)
 
  // Load all foundational data on startup
  const fetchAllData = async () => {
    try {
      const [quizzesRes, statsRes, recsRes] = await Promise.all([
        fetch(mdcatApi("/api/mdcat/quizzes")),
        fetch(mdcatApi("/api/mdcat/performance")),
        fetch(mdcatApi("/api/mdcat/recommendations")),
      ]);
 
      // Quizzes
      if (quizzesRes.ok) {
        const quizzesData = await quizzesRes.json();
        const rawQuizzes = Array.isArray(quizzesData.data)
          ? quizzesData.data
          : [];
        setQuizzes(rawQuizzes.map(mapQuiz));
      }
 
      // Performance
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setPerformanceStats({
          totalAttempts: statsData.totalAttempts || 0,
          averageScorePercent: statsData.averageScorePercent || 0,
          subjectBreakdown: statsData.subjectBreakdown || [],
          subTopicList: statsData.subTopicList || [],
          attemptHistory: statsData.attemptHistory || [],
          totalFocusMinutes: statsData.totalFocusMinutes || 0,
          focusSessions: statsData.focusSessions || [],
          studyStreak: statsData.studyStreak || 0,
        });
      }
      // Recommendations — safe, won't break others if it fails
      if (recsRes.ok) {
        try {
          const recsData = await recsRes.json();
          if (recsData.success) {
            setRecommendations(
              Array.isArray(recsData.data) ? recsData.data : [],
            );
          } else {
            setRecommendations([]);
          }
        } catch {
          setRecommendations([]);
        }
      } else {
        setRecommendations([]);
      }
    } catch (e) {
      console.error("[App] Failed to prefetch full-stack parameters:", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllData();
  }, []);
 
   const fetchRepeatedQuestions = async () => {
    try {
      setRepeatedLoading(true);
      const res = await fetch(mdcatApi("/api/mdcat/repeated-questions"));
      if (res.ok) {
        const json = await res.json();
        const raw = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
          ? json.data
          : [];
        setAllRepeatedQuestions(raw);
        setRepeatedVisibleCount(REPEATED_PAGE_SIZE); // reset to first 20
      } else {
        setAllRepeatedQuestions([]);
      }
    } catch (e) {
      console.error("[App] Failed to fetch repeated questions:", e);
      setAllRepeatedQuestions([]);
    } finally {
      setRepeatedLoading(false);
    }
  };

  const loadMoreRepeated = () => {
    setRepeatedVisibleCount((prev) =>
      Math.min(prev + REPEATED_PAGE_SIZE, allRepeatedQuestions.length)
    );
  };

  useEffect(() => {
    fetchRepeatedQuestions();
  }, []);
 
  // Fetch a single quiz with its full list of detailed questions
  const handleSelectQuiz = async (id: number) => {
      navigate(`/mdcat/quiz/${id}`);
     
    };
  // Callback when a dynamic AI quiz is compiled successfully
  const handleQuizGenerated = (newQuiz: Quiz) => {
    // AI generator returns { success: true, data: {...} } — safely unwrap
    const raw = (newQuiz as any).data ?? newQuiz;
    const quiz: Quiz = {
      ...mapQuiz(raw),
      questions: (raw.questions || []).map(mapQuestion),
    };
    setQuizzes((prev) => [quiz, ...prev]);
    setActiveQuiz(quiz);
    setSelectedQuizId(quiz.id);
    addNewAIQuestions(newQuiz.questions);
    navigate("/mdcat/ai-quiz");
   
  };
 
  // Refresh stats after attempt is saved
  const handleAttemptFinished = async () => {
    await fetchAllData();
  };
 
  // Subject color helper
  const getSubjectColorBadge = (subject: string) => {
    switch (subject) {
      case "Biology":
        return "bg-emerald-500";
      case "Chemistry":
        return "bg-amber-500";
      case "Physics":
        return "bg-purple-500";
      case "English":
        return "bg-blue-500";
      default:
        return "bg-rose-500";
    }
  };
  // Dynamic MDCAT countdown — exam date: 20 September 2026
  const examDate = new Date("2026-09-20T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = Math.max(
    0,
    Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
  );
 
 
  // Small wrapper so every page gets the same enter/exit motion without repeating it 5 times
 
 
  // Quiz session needs the id from the URL, not from local state
 
  return (
    <div className={`min-h-screen  bg-brand-50/70 text-slate-800 flex flex-col font-sans selection:bg-brand-200 transition-[filter] duration-200 ${isOpen ? "blur-md pointer-events-none select-none" : ""}`}>
      {/* Platform Header */}
      <Header setActiveQuiz={setActiveQuiz} activeTab={activeTab} setActiveTab={setActiveTab} daysLeft={daysLeft} selectedQuizId={selectedQuizId} setSelectedQuizId={setSelectedQuizId} />
 
 
<div className="grid flex-1 grid-rows-[minmax(0,1fr)] overflow-x-hidden min-h-0">
  <AnimatePresence mode="wait">
    <Routes location={location} key={location.pathname}>
      <Route
        path="/study-notes/*"
        element={
          <PageTransition>
            <SEO
              title="Study Notes"
              description="Browse subject-wise MDCAT study notes covering Biology, Chemistry, Physics, and English — aligned with the PMDC syllabus."
              path="/study-notes"
            />
            <StudyNotes onSelectQuiz={handleSelectQuiz} onBack={() => navigate("/mdcat/")} />
          </PageTransition>
        }
      />
      <Route
        path="/past-papers"
        element={
          <PageTransition>
            <SEO
              title="Past Papers"
              description="Practice with previous years' MDCAT past papers and solved MCQs to prepare effectively for your entry test."
              path="/past-papers"
            />
            {loading ? (
              <LoadingFrame />
            ) : (
              <PastPapers quizzes={quizzes} onSelectQuiz={handleSelectQuiz} />
            )}
          </PageTransition>
        }
      />
     
      <Route
        path="/ai-prep"
        element={
          <PageTransition>
            <SEO
              title="AI Quiz Generator"
              description="Generate custom AI-powered MDCAT practice quizzes by subject, topic, and difficulty level."
              path="/ai-prep"
            />
            <AIQuizGenerator
              onQuizGenerated={handleQuizGenerated}
              onBack={() => navigate("/mdcat/")}
              setActiveQuiz={setActiveQuiz}
            />
          </PageTransition>
        }
      />
      <Route
        path="/ai-quiz"
        element={
          <PageTransition>
            <SEO
              title="AI Generated Quiz"
              description="Take your AI-generated MDCAT practice quiz and test your knowledge instantly."
              path="/ai-quiz"
              noIndex
            />
            <AIQuizRoute quiz={activeQuiz} onAttemptFinished={handleAttemptFinished} />
          </PageTransition>
        }
      />
    
     
       <Route
        path="/repeated-questions"
        element={
          repeatedLoading ? <LoadingFrame /> :
          <RepeatedQuestions
            data={repeatedQuestions}
            loading={false}
            hasMore={repeatedHasMore}
            onLoadMore={loadMoreRepeated}
          />
          
        }
        
      />
      <Route
      path="/guess-paper"
      element={
        <SolvedPaper/>
      }
      />
 
      <Route
        path="/quiz/:quizId"
        element={
          <PageTransition>
            <SEO
              title="Quiz Session"
              description="Attempt your MDCAT practice quiz and track your performance in real time."
              path="/quiz"
              noIndex
            />
            <QuizSessionRoute
              loading={loading}
              quizzes={quizzes}
              onAttemptFinished={handleAttemptFinished}
            />
          </PageTransition>
        }
      />
      <Route
        path="/"
        element={
          <PageTransition>
            <div className="overflow-y-auto h-full">
              <SEO
                title="Dashboard"
                description="Your MDCAT prep dashboard — track performance, countdown to your test date, and jump into practice quizzes."
                path="/"
              />
              {loading ? (
                <LoadingFrame />
              ) : (
                <>
                  <Dashboard
                    testDate={examDate}
                    setActiveTab={setActiveTab}
                    performanceStats={performanceStats}
                    getSubjectColorBadge={getSubjectColorBadge}
                  />
                  <FAQ onBack={() => navigate("/mdcat")} />
                </>
              )}
            </div>
          </PageTransition>
        }
      />
      <Route
        element={
          <PageTransition>
            <SEO
              title="AI Tutor"
              description="Chat with your personal AI tutor for instant MDCAT concept help, explanations, and doubt-solving."
              path="/ai-tutor"
            />
            <div className="h-screen">
              <AiTutorPage />
            </div>
          </PageTransition>
        }
        path="/ai-tutor"
      />
    <Route
        element={
          <ProtectedRoute>
            <PageTransition>
              <SEO
                title="Performance Dashboard"
                description="View detailed performance stats, personalized recommendations, and quiz history for your MDCAT preparation."
                path="/dashboard"
              />
              {loading ? (
                <LoadingFrame />
              ) : (
                <DashBoard1
                  stats={performanceStats}
                  recommendations={recommendations}
                  onStartGenQuiz={() => navigate("/mdcat/ai-prep")}
                  onSelectQuiz={handleSelectQuiz}
                  availableQuizzes={quizzes}
                  refreshData={fetchAllData}
                />
              )}
            </PageTransition>
          </ProtectedRoute>
        }
        path="/dashboard"
      />
    </Routes>
 
</AnimatePresence>
</div>
      <Footer />
  </div>
  );
}

export default function MdcatApp() {
  return (
    <MdcatAuthOverlayProvider>
      <MdcatAppInner />
      <MdcatAuthOverlay />
    </MdcatAuthOverlayProvider>
  );
}
 