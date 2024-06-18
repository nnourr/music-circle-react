import { AnimatePresence, Variants, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../providers/user.provider";
import {
  LINEAR_GRADIENT_BREATHE_1,
  LINEAR_GRADIENT_BREATHE_2,
} from "../../../config/globals";
import { useSearchParams } from "react-router-dom";
import { useUserCircles } from "../../../providers/userCircles.provider";

const HomeState = React.forwardRef<HTMLDivElement>((_, ref) => {
  const [params] = useSearchParams();
  const [animationStep, setAnimationStep] = useState<number>(0);
  const { username } = useUser();

  const headingContainerVariants: Variants = {
    initial: { translateY: 0 },
    moveUp: {
      translateY: "-10vh",
      transition: { ease: "easeInOut" },
    },
  };

  const heyVariants: Variants = {
    initial: { opacity: 0 },
    visible: { opacity: 1 },
    hidden: { opacity: 0, transition: { ease: "easeOut" } },
  };

  const welcomeVariants: Variants = {
    initial: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };

  const musicCircleVariants: Variants = {
    initial: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };

  useEffect(() => {
    const noAnimation = params.get("noAnimation");
    if (!!!noAnimation) {
      const sequence = async () => {
        setAnimationStep(1);
        await new Promise((resolve) => setTimeout(resolve, 1250));
        setAnimationStep(2);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAnimationStep(3);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setAnimationStep(4);
      };
      sequence();
    } else {
      setAnimationStep(4);
    }
  }, [params]);

  const circleButtons = 

  return (
    <motion.div
      ref={ref}
      className="h-full w-full flex justify-center items-center flex-col gap-12 lg:gap-24"
    >
      <motion.div
        initial="initial"
        animate={animationStep >= 4 ? "moveUp" : ""}
        variants={headingContainerVariants}
        className="h-1/2 w-3/4 relative"
      >
        <AnimatePresence mode="wait">
          {animationStep === 1 && (
            <motion.h1
              key="hey"
              initial="initial"
              animate="visible"
              exit="hidden"
              variants={heyVariants}
              className="absolute text-white leading-none text-xl font-fancy lg:text-lg-xl"
            >
              hey {username},
            </motion.h1>
          )}
          {animationStep >= 2 && (
            <motion.h1
              key="welcome"
              initial="initial"
              animate="visible"
              exit="hidden"
              variants={welcomeVariants}
              className="text-white text-xl leading-none font-fancy lg:text-lg-xl"
            >
              welcome to
            </motion.h1>
          )}
          {animationStep >= 3 && (
            <motion.div
              key="musicCircle"
              className="bg-clip-text w-fit"
              initial="initial"
              animate="visible"
              exit="hidden"
              variants={musicCircleVariants}
            >
              <motion.h1
                animate={{
                  backgroundImage: [
                    LINEAR_GRADIENT_BREATHE_1,
                    LINEAR_GRADIENT_BREATHE_2,
                  ],
                }}
                transition={{
                  duration: 2,
                  ease: "circInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="text-transparent text-3xl lg:text-lg-3xl font-fancy bg-clip-text"
              >
                Music Circle
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div>

      </motion.div>
    </motion.div>
  );
});

const MotionHomeState = motion(HomeState, {
  forwardMotionProps: true,
});

export default MotionHomeState;
