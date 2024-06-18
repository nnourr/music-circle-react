import { AnimatePresence, Variants, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../providers/user.provider";
import {
  LINEAR_GRADIENT_BREATHE_1,
  LINEAR_GRADIENT_BREATHE_2,
} from "../../../config/globals";
import { useSearchParams } from "react-router-dom";
import { UserCircleListComponent } from "../components/userCircleList.component";
import { btnSizes } from "../../../components/inputs/button.input.component";
import { useIsMobile } from "../../../providers/isMobile.provider";

const HomeState = React.forwardRef<HTMLDivElement>((_, ref) => {
  const [params] = useSearchParams();
  const [animationStep, setAnimationStep] = useState<number>(0);
  const { username } = useUser();
  const isMobile = useIsMobile();

  const headingContainerVariants: Variants = {
    initial: { translateY: "20vh" },
    moveUp: {
      translateY: 0,
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

  const circleListVariants: Variants = {
    initial: { opacity: 0 },
    visible: {
      opacity: animationStep >= 5 ? 1 : 0,
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
        await new Promise((resolve) => setTimeout(resolve, 500));
        setAnimationStep(5);
      };
      sequence();
    } else {
      setAnimationStep(5);
    }
  }, [params]);

  return (
    <motion.div
      className="h-full w-full flex justify-center items-center"
      ref={ref}
    >
      <motion.div className="h-2/3 min-h-[42rem] w-full p-8 lg:w-[90rem] lg:h-2/3 flex flex-col">
        <motion.div
          initial="initial"
          animate={animationStep >= 4 ? "moveUp" : ""}
          variants={headingContainerVariants}
          className="lg:h-1/2 lg:w-3/4 relative"
        >
          <AnimatePresence mode="wait">
            {animationStep === 1 && (
              <motion.h1
                key="hey"
                initial="initial"
                animate="visible"
                exit="hidden"
                variants={heyVariants}
                className="absolute text-white w-full leading-none text-xl font-fancy lg:text-lg-xl"
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
                className="text-white text-xl leading-none font-fancy lg:text-lg-xl w-full text-nowrap"
              >
                welcome to
              </motion.h1>
            )}
          </AnimatePresence>
          {animationStep >= 3 && (
            <motion.div
              key="musicCircle"
              className="bg-clip-text w-full lg:w-fit"
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
        </motion.div>
        <motion.div
          variants={circleListVariants}
          initial="initial"
          animate="visible"
        >
          <motion.span className="font-bold bg-linear-gradient text-transparent bg-clip-text text-1xl lg:text-lg-1xl mt-8">
            your circles:
          </motion.span>
          <UserCircleListComponent
            key="HomeUserCircleList"
            btnSize={isMobile ? btnSizes.md : btnSizes.xl}
            className="flex flex-col lg:grid-cols-3 lg:grid lg:gap-4"
            showAddCircle={true}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

const MotionHomeState = motion(HomeState, {
  forwardMotionProps: true,
});

export default MotionHomeState;
