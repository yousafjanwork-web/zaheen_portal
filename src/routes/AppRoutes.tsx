import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../modules/home/pages/Home";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import ScrollToTop from "@/modules/shared/components/ScrollToTop";
import GradesView from "@/modules/courses/pages/GradesView";
import ClassSubjectsView from "@/modules/courses/pages/ClassSubjectsView";
import LecturesPage from "@/modules/lectures/pages/LecturesPage";
import Assessment from '@/modules/assessments/pages/Assessment';
import SkillsChaptersPage from "@/modules/courses/pages/SkillsChaptersPage";
import PracticeCornerPage from "@/modules/practice/pages/PracticeCornerPage";
import WorksheetsPage from "@/modules/worksheets/pages/WorksheetPage";
import BoardResultsPage from "@/modules/results/pages/BoardResultsPage";
import SubscribePage  from "@/modules/auth/pages/SubscribePage";
import LoginPage from "@/modules/auth/pages/LoginPage";
import Chatbot from "@/modules/aiTutor/pages/Chatbot";
import MzaPage from "@/pages/MzaPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MainLayout>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/grade-view/:type" element={<GradesView />} />
          <Route path="/class/:classId" element={<ClassSubjectsView />} />
          <Route path="/assessment/:chapterId" element={<Assessment />} />
          <Route
            path="/lectures/:className/:chapterId/:chapterName"
            element={<LecturesPage />}
          />
          <Route path="/skills/:classId" element={<SkillsChaptersPage />} />
          <Route path="/practice" element={<PracticeCornerPage />} />
          <Route path="/worksheets/:subjectId" element={<WorksheetsPage />} />
          <Route path="/results" element={<BoardResultsPage />} />
          <Route path="/ai" element={<Chatbot />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mza" element={<MzaPage />} />

        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default AppRoutes;