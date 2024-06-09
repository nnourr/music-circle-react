import { motion } from "framer-motion";
import React, { useState } from "react";
import MotionEnterAnimation from "./states/enterAnimation.state";
import { NavbarComponent } from "./components/navbar.component";
import { CircleShowcaseComponent } from "./components/circleShowcase.component";

const HomePage = React.forwardRef<HTMLDivElement>((_, ref) => {
  const [isEntering, setIsEntering] = useState<boolean>(true);

  setTimeout(() => {
    setIsEntering(false);
  }, 4700);

  const fakeCircle = {
    circleName: "Shelbyville",
  };

  return (
    <div ref={ref} className="h-full w-full">
      {isEntering ? (
        <div className="h-full w-full flex items-center justify-center">
          <MotionEnterAnimation />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full w-full"
        >
          <NavbarComponent menuClicked={() => console.log("menu clicked")} />
          <CircleShowcaseComponent circleInfo={fakeCircle} />
        </motion.div>
      )}
    </div>
  );
});

const MotionHomePage = motion(HomePage, {
  forwardMotionProps: true,
});

export default MotionHomePage;
