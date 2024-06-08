import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import MotionLandingPage from "./pages/landing/landing.page";
import MotionHomePage from "./pages/home/home.page";
import { NotFoundPage } from "./pages/notfound/notfound.page";

export const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MotionLandingPage key="landingPage" />} />
        <Route
          path="home"
          element={
            <MotionHomePage
              exit={{
                opacity: 0,
                transition: { duration: 2 },
              }}
              key="homePage"
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};
