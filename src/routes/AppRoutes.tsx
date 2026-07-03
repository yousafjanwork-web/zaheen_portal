import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../modules/home/pages/Home";
import TermsOfService from "@/pages/TermsOfService";
import FAQ from "@/pages/FaqZaheen";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import ScrollToTop from "@/modules/shared/components/ScrollToTop";
import GradesView from "@/modules/courses/pages/GradesView";
import LecturesPage from "@/modules/lectures/pages/LecturesPage";
import Assessment from "@/modules/assessments/pages/Assessment";
import AssessmentQuiz from "@/modules/assessments/pages/AssessmentQuiz";
import SkillsChaptersPage from "@/modules/courses/pages/SkillsChaptersPage";
import PracticeCornerPage from "@/modules/practice/pages/PracticeCornerPage";
import WorksheetsPage from "@/modules/worksheets/pages/WorksheetPage";
import BoardResultsPage from "@/modules/results/pages/BoardResultsPage";
import SubscribePage from "@/modules/auth/pages/SubscribePage";
import LoginPage from "@/modules/auth/pages/LoginPage";
import Chatbot from "@/modules/aiTutor/pages/Chatbot";
import AiTutorMobile from "@/modules/aiTutor/pages/AiTutorMobile";
import MzaPage from "@/pages/MzaPage";
import ResourcesPage from "@/modules/courses/pages/ResourcesPage";
import ResourcePlayer from "@/modules/courses/pages/ResourcesPlayer";
import { EnrollmentLandingPage } from "@/modules/auth/enrollnow/EnrollNowPage";
import { MdcatEnrollmentLandingPage } from "@/modules/auth/enrollnow/pages/MdcatEnrollNowPage";
import { LearningPage }  from "@/modules/auth/enrollnow/pages/LearningPage";
import SubEnrollNow from "@/modules/auth/enrollnow/pages/SubEnrollNow";
import SuccessScreen from "@/modules/ThankyouPage/pages/SuccessScreen";
import GamesPage from "@/modules/games/pages/GamesPage";
import PlayGamePage from "@/modules/games/pages/PlayGamePage";
import PastPapersPage from "@/modules/courses/pages/PastPapersPage";
import AllProfessionalCourses from "@/modules/home/sections/AllProfessionalCourses";

// ✅ Routers that pick the right view based on class type
import ClassSubjectsRouter from "@/modules/courses/pages/ClassSubjectsRouter";
import SubjectLecturesRouter from "@/modules/courses/pages/SubjectLecturesRouter";
import PrimaryGradesQuiz from "@/modules/courses/pages/PrimaryGradesQuizz"
import { MdcatApp } from "../mdcat";
import { CosmokidApp } from "../cosmokid";
import { VocabApp } from "../vocab";

import { MDCATmobile } from "../mdcat/components/MDCATmobile";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>

        {/* ── Routes WITH MainLayout ── */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/faqzaheen" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/grade-view/:type" element={<GradesView />} />
          <Route path="/all-professional-courses" element={<AllProfessionalCourses />} />

         
          <Route path="/class/:classId" element={<ClassSubjectsRouter />} />

         
          <Route
            path="/class/:classId/subject/:subjectId"
            element={<SubjectLecturesRouter />}
          />
          <Route path="/class/:classId/quiz" element={<PrimaryGradesQuiz />} />
          <Route path="/assessment/" element={<Assessment />} />
          <Route path="/assessment/:skillId" element={<AssessmentQuiz />} />
          <Route
            path="/lectures/:className/:chapterId/:chapterName"
            element={<LecturesPage />}
          />
          <Route
            path="/class/:classId/subject/:subjectId/past-papers"
            element={<PastPapersPage />}
          />
          <Route path="/skills/:classId" element={<SkillsChaptersPage />} />
          <Route path="/practice" element={<PracticeCornerPage />} />
          <Route path="/worksheets/:subjectId" element={<WorksheetsPage />} />
          <Route path="/results" element={<BoardResultsPage />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mza" element={<MzaPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resource-player" element={<ResourcePlayer />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/play" element={<PlayGamePage />} />
        
          <Route path="/ai" element={<Chatbot />} />
        </Route>

        {/* ── Routes WITHOUT MainLayout ── */}
        <Route path="/enrollnow" element={<EnrollmentLandingPage />} />
          <Route path="/aitutor-mobile" element={<AiTutorMobile />} />
        <Route path="/enrollnow-mdcat" element={<MdcatEnrollmentLandingPage />} />
        <Route path="/learning" element={<LearningPage />} /> 
        <Route path="/sub_enrollnow" element={<SubEnrollNow />} />
        <Route path="thanks-for-subscribing" element={<SuccessScreen />} />
       {/* // mdcat route */}
<Route path="/mdcat/*" element={<MdcatApp />} />
<Route path="/mdcat-mobile/*" element={<MDCATmobile />} />

      {/* existing Zaheen routes */}
      <Route path="/cosmokid/*" element={<CosmokidApp />} />
       <Route path="/vocab/*" element={<VocabApp />} />
  

{/* AppRoutes.tsx mein */}


      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;