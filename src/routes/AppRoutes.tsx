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
import { SocialEnrollmentLandingPage } from "@/modules/auth/enrollnow/pages/SocialEnrollNowPage";
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
import SocialCallbackPage       from "../modules/auth/pages/SocialCallbackPage";
import MdcatLoginPage           from "../mdcat/pages/MdcatLoginPage";
import MdcatSocialCallbackPage  from "../mdcat/pages/MdcatSocialCallbackPage";
import MdcatProfilePage         from "../mdcat/pages/MdcatProfilePage";
import PaymentPage        from "../payment/payment";
import CardPaymentPage    from "../payment/CardPaymentPage";
import MwalletRecurring   from "../payment/MwalletRecurring";
import RecurringSuccess   from "../payment/RecurringSuccess";
import PaymentWithoutCnic from "../payment/PaymentWithoutCnic";
import NotFound from "../pages/NotFound";
import PrepExam from "../pages/PrepExam";


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
          <Route path="/"                            element={<><TitleSetter title="Zaheen | Home" /><Home /></>} />
          <Route path="/terms"                       element={<><TitleSetter title="Zaheen | Terms of Service" /><TermsOfService /></>} />
          <Route path="/faqzaheen"                   element={<><TitleSetter title="Zaheen | FAQ" /><FAQ /></>} />
          <Route path="/thankyou"                    element={<><TitleSetter title="Zaheen | Thank You" /><ThankYouPage /></>} />
          <Route path="/privacy"                     element={<><TitleSetter title="Zaheen | Privacy Policy" /><PrivacyPolicy /></>} />
          <Route path="/grade-view/:type"            element={<><TitleSetter title="Zaheen | Grades" /><GradesView /></>} />
          <Route path="/all-professional-courses"    element={<><TitleSetter title="Zaheen | Professional Courses" /><AllProfessionalCourses /></>} />
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
          <Route path="/skills/:classId"             element={<><TitleSetter title="Zaheen | Skills" /><SkillsChaptersPage /></>} />
          <Route path="/practice"                    element={<><TitleSetter title="Zaheen | Practice Corner" /><PracticeCornerPage /></>} />
          <Route path="/worksheets/:subjectId"       element={<><TitleSetter title="Zaheen | Worksheets" /><WorksheetsPage /></>} />
          <Route path="/results"                     element={<><TitleSetter title="Zaheen | Board Results" /><BoardResultsPage /></>} />
          <Route path="/subscribe"                   element={<><TitleSetter title="Zaheen | Subscribe" /><SubscribePage /></>} />
          <Route path="/mza"                         element={<><TitleSetter title="Zaheen | MZA" /><MzaPage /></>} />
          <Route path="/resources"                   element={<><TitleSetter title="Zaheen | Resources" /><ResourcesPage /></>} />
          <Route path="/resource-player"             element={<><TitleSetter title="Zaheen | Resource Player" /><ResourcePlayer /></>} />
          <Route path="/games/:type"                 element={<><TitleSetter title="Zaheen | Games" /><GamesPage /></>} />
          <Route path="/games/:type/play/:game"      element={<><TitleSetter title="Zaheen | Play Game" /><PlayGamePage /></>} />
          <Route path="/ai"                          element={<><TitleSetter title="Zaheen | AI Tutor" /><Chatbot /></>} />
          <Route path="/prep-exam"                   element={<><TitleSetter title="Zaheen | Prep Exam" /><PrepExam /></>} />

          {/* ── Payment ── */}
          <Route path="/pay-with-jazzcash"                                     element={<><TitleSetter title="Zaheen | Pay with JazzCash" /><PaymentPage /></>} />
          <Route path="/pay-with-jazzcash/card"                                element={<><TitleSetter title="Zaheen | Card Payment" /><CardPaymentPage /></>} />
          <Route path="/pay-with-jazzcash/mwallet-recurring"                   element={<><TitleSetter title="Zaheen | Recurring Payment" /><MwalletRecurring /></>} />
          <Route path="/pay-with-jazzcash/mwallet-recurring/recurring-success" element={<><TitleSetter title="Zaheen | Payment Successful" /><RecurringSuccess /></>} />
          <Route path="/pay-with-jazzcash/mwallet-withoutcnic"                 element={<><TitleSetter title="Zaheen | Pay without CNIC" /><PaymentWithoutCnic /></>} />

          {/* ── Login ── */}
          <Route path="/login" element={<><TitleSetter title="Zaheen | Login" /><LoginPage /></>} />

          {/* ── Profile ── */}
          <Route path="/profile" element={<><TitleSetter title="Zaheen | Profile" /><ProfilePage /></>} />

          {/* ── Callbacks ── */}
          <Route path="/social-callback"      element={<><TitleSetter title="Zaheen | Connecting..." /><SocialCallbackPage /></>} />
          <Route path="/mdcat-login"           element={<><TitleSetter title="Zaheen | MDCAT Login" /><MdcatLoginPage /></>} />
          <Route path="/mdcat-social-callback" element={<><TitleSetter title="Zaheen | MDCAT Connecting..." /><MdcatSocialCallbackPage /></>} />
          <Route path="/mdcat-profile"         element={<><TitleSetter title="Zaheen | MDCAT Profile" /><MdcatProfilePage /></>} />

          {/* ── ✅ Protected: Setup flow ── */}
          <Route element={<SetupGuard requireAuth />}>
            <Route path="/setup/role"         element={<><TitleSetter title="Zaheen | Setup — Role" /><SetupRolePage /></>} />
            <Route path="/setup/grade-course" element={<><TitleSetter title="Zaheen | Setup — Grade & Course" /><SetupGradeCoursePage /></>} />
            <Route path="/setup/add-child"    element={<><TitleSetter title="Zaheen | Setup — Add Child" /><SetupAddChildPage /></>} />
          </Route>

          {/* ── ✅ Protected: Dashboard ── */}
          <Route element={<SetupGuard requireAuth />}>
            <Route path="/dashboard" element={<><TitleSetter title="Zaheen | Dashboard" /><DashboardPage /></>} />
          </Route>

          {/* ── ✅ Catch-all: 404 with navbar/footer ── */}
          <Route path="*" element={<><TitleSetter title="Zaheen | Page Not Found" /><NotFound /></>} />
        </Route>

        {/* ══ Routes WITHOUT MainLayout ══ */}
        <Route path="/enrollnow"             element={<><TitleSetter title="Zaheen | Enroll Now" /><EnrollmentLandingPage /></>} />
        <Route path="/enrollnow-social"      element={<><TitleSetter title="Zaheen | Enroll Now — Social" /><SocialEnrollmentLandingPage /></>} />
        <Route path="/aitutor-mobile"        element={<><TitleSetter title="Zaheen | AI Tutor" /><AiTutorMobile /></>} />
        <Route path="/enrollnow-mdcat"       element={<><TitleSetter title="Zaheen | Enroll Now — MDCAT" /><MdcatEnrollmentLandingPage /></>} />
        <Route path="/learning"              element={<><TitleSetter title="Zaheen | Learning" /><LearningPage /></>} />
        <Route path="/sub_enrollnow"         element={<><TitleSetter title="Zaheen | Subscribe & Enroll" /><SubEnrollNow /></>} />
        <Route path="thanks-for-subscribing" element={<><TitleSetter title="Zaheen | Subscribed!" /><SuccessScreen /></>} />

        {/* ── Mini-apps ── */}
        <Route path="/mdcat/*"          element={<><TitleSetter title="Zaheen | MDCAT Prep — AI Practice" /><MdcatApp /></>} />
        <Route path="/mdcat-mobile/*"   element={<><TitleSetter title="Zaheen | MDCAT Prep — AI Practice" /><MdcatAppMobile /></>} />
        <Route path="/cosmokid/*"       element={<><TitleSetter title="Zaheen | Cosmokid" /><CosmokidApp /></>} />
        <Route path="/cosmokid-mobile"  element={<><TitleSetter title="Zaheen | Cosmokid" /><CosmoKidMobile /></>} />
        <Route path="/vocab/*"          element={<><TitleSetter title="Zaheen | Vocab" /><VocabApp /></>} />
        <Route path="/vocab-mobile/*"   element={<><TitleSetter title="Zaheen | Vocab" /><VocabMobileApp /></>} />
        <Route path="/origami/*"        element={<><TitleSetter title="Zaheen | Origami" /><OrigamiApp /></>} />
        <Route path="/origami-mobile/*" element={<><TitleSetter title="Zaheen | Origami" /><OrigamiMobileApp /></>} />
        <Route path="/pakistan/*"       element={<><TitleSetter title="Zaheen | Pakistan" /><DiscoverPakistanApp /></>} />
        <Route path="/pakistan-mobile/*" element={<><TitleSetter title="Zaheen | Pakistan" /><PakistanMobileApp /></>} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;