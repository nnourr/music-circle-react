import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import MotionLandingPage from "./pages/landing/landing.page";
import MotionHomePage from "./pages/home/home.page";
import { Privacy } from "./pages/privacy/privacy.page";

export const App = () => {
  const location = useLocation();
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/*" element={<MotionLandingPage key="landingPage" />} />
          <Route path="home" element={<MotionHomePage key="homePage" />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};
