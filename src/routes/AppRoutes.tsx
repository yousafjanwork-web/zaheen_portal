/**
 * AppRoutes.tsx — Updated with Zaheen setup flow routes
 *
 * New routes added:
 *   /profile?setup=true   → ProfilePage in setup mode (Step 1)
 *   /setup/role           → SetupRolePage (Step 2)
 *   /setup/grade-course   → SetupGradeCoursePage (Step 3A/C)
 *   /setup/add-child      → SetupAddChildPage (Step 3B/C)
 *   /dashboard            → DashboardPage (protected)
 *
 * All setup/* and /dashboard routes are wrapped in SetupGuard
 * which redirects to /login if not authenticated.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

// ── Layouts ──
import MainLayout from "../layouts/MainLayout";

// ── Public pages ──
import Home               from "../modules/home/pages/Home";
import TermsOfService     from "@/pages/TermsOfService";
import FAQ                from "@/pages/FaqZaheen";
import ThankYouPage       from "@/pages/ThankYouPage";
import PrivacyPolicy      from "@/pages/PrivacyPolicy";
import MzaPage            from "@/pages/MzaPage";
import ResourcesPage      from "@/modules/courses/pages/ResourcesPage";
import ResourcePlayer     from "@/modules/courses/pages/ResourcesPlayer";
import AllProfessionalCourses from "@/modules/home/sections/AllProfessionalCourses";
import PastPapersPage     from "@/modules/courses/pages/PastPapersPage";
import BoardResultsPage   from "@/modules/results/pages/BoardResultsPage";
import GamesPage          from "@/modules/games/pages/GamesPage";
import PlayGamePage       from "@/modules/games/pages/PlayGamePage";
import WorksheetsPage     from "@/modules/worksheets/pages/WorksheetPage";
import PracticeCornerPage from "@/modules/practice/pages/PracticeCornerPage";
import SkillsChaptersPage from "@/modules/courses/pages/SkillsChaptersPage";
import LecturesPage       from "@/modules/lectures/pages/LecturesPage";

// ── Auth / Subscribe ──
import SubscribePage      from "@/modules/auth/pages/SubscribePage";
import { EnrollmentLandingPage }     from "@/modules/auth/enrollnow/EnrollNowPage";
import { MdcatEnrollmentLandingPage } from "@/modules/auth/enrollnow/pages/MdcatEnrollNowPage";
import { LearningPage }              from "@/modules/auth/enrollnow/pages/LearningPage";
import SubEnrollNow       from "@/modules/auth/enrollnow/pages/SubEnrollNow";
import SuccessScreen      from "@/modules/ThankyouPage/pages/SuccessScreen";

// ── AI Tutor ──
import Chatbot            from "@/modules/aiTutor/pages/Chatbot";
import AiTutorMobile      from "@/modules/aiTutor/pages/AiTutorMobile";

// ── Quiz / Assessment ──
import SecondaryQuizFlow  from "../modules/assessments/pages/SecondaryQuizFlow";
import PrimaryQuizFlow    from "../modules/assessments/pages/PrimaryQuizFlow";
import QuizRouter         from "@/modules/courses/pages/QuizRouter";

// ── Grade / Subject routers ──
import GradesView          from "@/modules/courses/pages/GradesView";
import ClassSubjectsRouter from "@/modules/courses/pages/ClassSubjectsRouter";
import SubjectLecturesRouter from "@/modules/courses/pages/SubjectLecturesRouter";

// ── Shared ──
import ScrollToTop from "@/modules/shared/components/ScrollToTop";

// ── Mini-apps ──
import { MdcatApp }           from "../mdcat";
import MdcatAppMobile         from "@/mdcat/MdcatAppMobile";
import { CosmokidApp }        from "../cosmokid";
import CosmoKidMobile         from "../cosmokid/Cosmokidmobile";
import { VocabApp }           from "../vocab";
import VocabMobileApp         from "../vocab/Vocabmobileapp";
import { OrigamiApp }         from "../origami";
import OrigamiMobileApp       from "../origami/Origamimobileapp";
import { DiscoverPakistanApp } from "../pakistan";
import PakistanMobileApp      from "../pakistan/PakistanMobileApp";

// ── ✅ NEW: Login, Profile, Setup flow, Dashboard ──
import LoginPage            from "../modules/auth/pages/LoginPage";
import ProfilePage          from "../pages/ProfilePage";
import SetupRolePage        from "../modules/lms/pages/setup/SetupRolePage";
import SetupGradeCoursePage from "../modules/lms/pages/setup/SetupGradeCoursePage";
import SetupAddChildPage    from "../modules/lms/pages/setup/SetupAddChildPage";
import DashboardPage        from "../modules/lms/pages/dashboard/DashboardPage";
import SetupGuard           from "../modules/lms/components/SetupGuard";
// import PackagesPage from "../modules/auth/pages/PackagesPage";
// import PaymentPage  from "../modules/auth/pages/PaymentPage";
import SocialCallbackPage from "../modules/auth/pages/SocialCallbackPage";


// ─────────────────────────────────────────────────────────────────────────────
const TitleSetter = ({ title }: { title: string }) => {
  useEffect(() => { document.title = title; }, [title]);
  return null;
};
const AppRoutes = () => {
  useEffect(() => {
    const disableRightClick = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);
    return () => document.removeEventListener("contextmenu", disableRightClick);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>

        {/* ══ Routes WITH MainLayout ══ */}
        <Route element={<MainLayout />}>
          <Route path="/"                            element={<Home />} />
          <Route path="/terms"                       element={<TermsOfService />} />
          <Route path="/faqzaheen"                   element={<FAQ />} />
          <Route path="/thankyou"                    element={<ThankYouPage />} />
          <Route path="/privacy"                     element={<PrivacyPolicy />} />
          <Route path="/grade-view/:type"            element={<GradesView />} />
          <Route path="/all-professional-courses"    element={<AllProfessionalCourses />} />
          <Route path="/:classSlug"                  element={<ClassSubjectsRouter />} />
          <Route path="/:classSlug/:subjectSlug"     element={<SubjectLecturesRouter />} />
          <Route path="/:classSlug/quiz"             element={<QuizRouter />} />
          <Route path="/:classSlug/quiz"             element={<PrimaryQuizFlow />} />
          <Route path="/:classSlug/quiz/secondary"   element={<SecondaryQuizFlow />} />
          <Route
            path="/lectures/:className/:chapterId/:chapterName"
            element={<LecturesPage />}
          />
          <Route path="/:classSlug/:subjectSlug/past-papers" element={<PastPapersPage />} />
          <Route path="/skills/:classId"             element={<SkillsChaptersPage />} />
          <Route path="/practice"                    element={<PracticeCornerPage />} />
          <Route path="/worksheets/:subjectId"       element={<WorksheetsPage />} />
          <Route path="/results"                     element={<BoardResultsPage />} />
          <Route path="/subscribe"                   element={<SubscribePage />} />
          <Route path="/mza"                         element={<MzaPage />} />
          <Route path="/resources"                   element={<ResourcesPage />} />
          <Route path="/resource-player"             element={<ResourcePlayer />} />
          <Route path="/games/:type"                 element={<GamesPage />} />
          <Route path="/games/:type/play/:game"      element={<PlayGamePage />} />
          <Route path="/ai"                          element={<Chatbot />} />

          {/* ── Login ── */}
          <Route path="/login" element={<LoginPage />} />

          {/* ── Profile (works in both normal and setup mode) ── */}
          <Route path="/profile" element={<ProfilePage />} />
          {/* <Route path="/packages" element={<PackagesPage />} />
          <Route path="/payment"  element={<PaymentPage />} /> */}
           <Route path="/social-callback" element={<SocialCallbackPage />} />

          {/* ── ✅ Protected: Setup flow ── */}
          <Route element={<SetupGuard requireAuth />}>
            <Route path="/setup/role"         element={<SetupRolePage />} />
            <Route path="/setup/grade-course" element={<SetupGradeCoursePage />} />
            <Route path="/setup/add-child"    element={<SetupAddChildPage />} />
          </Route>

          {/* ── ✅ Protected: Dashboard ── */}
          <Route element={<SetupGuard requireAuth />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Route>

        {/* ══ Routes WITHOUT MainLayout ══ */}
        <Route path="/enrollnow"             element={<EnrollmentLandingPage />} />
        <Route path="/aitutor-mobile"        element={<AiTutorMobile />} />
        <Route path="/enrollnow-mdcat"       element={<MdcatEnrollmentLandingPage />} />
        <Route path="/learning"              element={<LearningPage />} />
        <Route path="/sub_enrollnow"         element={<SubEnrollNow />} />
        <Route path="thanks-for-subscribing" element={<SuccessScreen />} />

       {/* ── Mini-apps ── */}
<Route path="/mdcat/*" element={<><TitleSetter title="Zaheen | MDCAT Prep — AI Practice" /><MdcatApp /></>} />
<Route path="/mdcat-mobile/*" element={<><TitleSetter title="Zaheen | MDCAT Prep — AI Practice" /><MdcatAppMobile /></>} />
<Route path="/cosmokid/*" element={<><TitleSetter title="Zaheen | Cosmokid" /><CosmokidApp /></>} />
<Route path="/cosmokid-mobile" element={<><TitleSetter title="Zaheen | Cosmokid" /><CosmoKidMobile /></>} />
<Route path="/vocab/*" element={<><TitleSetter title="Zaheen | Vocab" /><VocabApp /></>} />
<Route path="/vocab-mobile/*" element={<><TitleSetter title="Zaheen | Vocab" /><VocabMobileApp /></>} />
<Route path="/origami/*" element={<><TitleSetter title="Zaheen | Origami" /><OrigamiApp /></>} />
<Route path="/origami-mobile/*" element={<><TitleSetter title="Zaheen | Origami" /><OrigamiMobileApp /></>} />
<Route path="/pakistan/*" element={<><TitleSetter title="Zaheen | Pakistan" /><DiscoverPakistanApp /></>} />
<Route path="/pakistan-mobile/*" element={<><TitleSetter title="Zaheen | Pakistan" /><PakistanMobileApp /></>} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;