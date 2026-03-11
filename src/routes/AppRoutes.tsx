import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import ScrollToTop from "@/components/ScrollToTop";
import GradesView from "@/pages/GradesView";

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
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default AppRoutes;