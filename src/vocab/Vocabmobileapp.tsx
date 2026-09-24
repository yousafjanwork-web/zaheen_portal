import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LessonsProvider } from "./context/LessonsContext";
import { useAuth as useZaheenAuth } from "@/modules/shared/context/AuthContext";
import { useMobileAutoLogin } from "@/modules/shared/hooks/useMobileAutoLogin";
import MobileLayout from "./components/MobileLayout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import LessonPlayer from "./pages/LessonPlayer";
import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import Achievements from "./pages/Achievements";
import AdminPanel from "./pages/AdminPanel";
import WordGarden from "./pages/WordGarden";
import Leaderboard from "./pages/Leaderboard";
import StoryStudio from "./pages/StoryStudio";
import Quests from "./pages/Quests";
import Flashcards from "./pages/Flashcards";

function VocabMobileRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route element={<MobileLayout />}>
        <Route
          path=""
          element={
            user?.role === "admin" ? (
              <Navigate to="/vocab-mobile/admin" replace />
            ) : (
              <Home />
            )
          }
        />
        <Route path="courses" element={<Courses />} />
        <Route path="lesson/:lessonId" element={<LessonPlayer />} />
        <Route
          path="dashboard"
          element={
            user?.role === "parent" ? <ParentDashboard /> : <StudentDashboard />
          }
        />
        <Route path="achievements" element={<Achievements />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="quests" element={<Quests />} />
        <Route path="word-garden" element={<WordGarden />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="story-studio" element={<StoryStudio />} />
        <Route
          path="admin"
          element={
            user?.role === "admin" ? (
              <AdminPanel />
            ) : (
              <Navigate to="/vocab-mobile" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/vocab-mobile" replace />} />
      </Route>
    </Routes>
  );
}

export default function VocabMobileApp() {
  const { ready } = useMobileAutoLogin();
  const { token, isLoggedIn, displayName } = useZaheenAuth() as {
    token?: string | null;
    isLoggedIn: boolean;
    displayName?: string | null;
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <LessonsProvider>
      <AuthProvider token={token} isLoggedIn={isLoggedIn} displayName={displayName ?? null}>
        <VocabMobileRoutes />
      </AuthProvider>
    </LessonsProvider>
  );
}