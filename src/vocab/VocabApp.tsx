import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
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

/**
 * No login/sign-up here — Zaheen's own auth already gated access before this
 * module ever mounts. `user.role` still drives which dashboard/home a person
 * sees; it's just no longer guarded behind a local sign-in flow.
 */
function VocabRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path=""
          element={
            user?.role === "admin" ? (
              <Navigate to="/vocab/admin" replace />
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
              <Navigate to="/vocab" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/vocab" replace />} />
      </Route>
    </Routes>
  );
}

/**
 * VocabApp — drop this inside a <Route path="/vocab/*"> in Zaheen's router.
 * It wraps everything in its own AuthProvider (localStorage-based, no API,
 * no login screen — the signed-in Zaheen user is assumed already).
 */
export default function VocabApp() {
  return (
    <AuthProvider>
      <VocabRoutes />
    </AuthProvider>
  );
}
