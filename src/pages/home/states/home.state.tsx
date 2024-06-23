import { Variants, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useUser } from "../../../providers/user.provider";
import {
  LINEAR_GRADIENT_BREATHE_1,
  LINEAR_GRADIENT_BREATHE_2,
} from "../../../config/globals";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { UserCircleListComponent } from "../components/userCircleList.component";
import Button, {
  btnSizes,
} from "../../../components/inputs/button.input.component";
import { useIsMobile } from "../../../providers/isMobile.provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

const HomeState = React.forwardRef<HTMLDivElement>((_, ref) => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [animationStep, setAnimationStep] = useState<number>(0);
  const { username } = useUser();
  const isMobile = useIsMobile();

  const headingContainerVariants: Variants = {
    initial: { translateY: "20vh" },
    moveUp: {
      translateY: 0,
      transition: { ease: "backOut", duration: 0.6 },
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
    const fullSequence = async () => {
      setAnimationStep(1);
      await new Promise((resolve) => setTimeout(resolve, 1250));
      setAnimationStep(1.5);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setAnimationStep(2);
      await new Promise((resolve) => setTimeout(resolve, 700));
      setAnimationStep(3);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAnimationStep(4);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAnimationStep(5);
    };
    const shortSequence = async () => {
      setAnimationStep(4);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAnimationStep(5);
    };
    if (!!!noAnimation) {
      fullSequence();
    } else {
      shortSequence();
    }
  }, [params]);

  return (
    <motion.div
      className="h-full w-full flex justify-center items-center"
      ref={ref}
    >
      <motion.div className="lg:min-h-[42rem] w-full h-fit max-h-full p-8 lg:w-[90rem] lg:h-2/3 flex flex-col">
        <motion.div
          initial="initial"
          animate={animationStep >= 4 ? "moveUp" : ""}
          variants={headingContainerVariants}
          className="lg:h-1/2 lg:w-3/4 relative"
        >
          <motion.h1
            initial="initial"
            key="hey"
            animate={animationStep === 1 ? "visible" : "initial"}
            variants={heyVariants}
            className="absolute text-white w-full leading-none text-xl font-fancy lg:text-lg-xl"
          >
            hey {username},
          </motion.h1>
          <motion.h1
            initial="initial"
            key="welcome"
            animate={animationStep >= 2 ? "visible" : "initial"}
            variants={welcomeVariants}
            className="text-white text-xl leading-none font-fancy lg:text-lg-xl w-full text-nowrap"
          >
            welcome to
          </motion.h1>
          <motion.div
            initial="initial"
            key="musicCircle"
            className="bg-clip-text w-full lg:w-fit"
            animate={animationStep >= 3 ? "visible" : "initial"}
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
              Music Circle.
            </motion.h1>
          </motion.div>
        </motion.div>
        <motion.span
          variants={circleListVariants}
          initial="initial"
          animate="visible"
          className="text text-1xl lg:text-lg-1xl mt-4 lg:mb-4 flex w-full justify-between items-baseline"
        >
          <span className="font-bold bg-linear-gradient text-transparent bg-clip-text">
            your circles:
          </span>
          {!isMobile && (
            <motion.div
              variants={circleListVariants}
              initial="initial"
              animate="visible"
            >
              <Button
                white={true}
                className="w-max text-nowrap flex justify-between px-8 font-normal"
                btnSize={btnSizes.md}
                title="Join or Create Circle"
                onClick={() => {
                  navigate({
                    pathname: "/createCircle",
                    search: createSearchParams({
                      noRedirect: "true",
                    }).toString(),
                  });
                }}
              >
                add circle
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="pt-1.5 rotate-45"
                />
              </Button>{" "}
            </motion.div>
          )}
        </motion.span>
        <motion.div
          variants={circleListVariants}
          initial="initial"
          animate="visible"
          className="h-fit max-h-full overflow-y-auto"
        >
          <UserCircleListComponent
            key="HomeUserCircleList"
            btnSize={isMobile ? btnSizes.md : btnSizes.xl}
            className="flex flex-col lg:grid-cols-3 lg:grid lg:gap-4"
          />
        </motion.div>

        {isMobile && (
          <motion.div
            variants={circleListVariants}
            initial="initial"
            animate="visible"
          >
            <Button
              className="w-full mb-3"
              white={true}
              btnSize={isMobile ? btnSizes.md : btnSizes.xl}
              title="Join or Create Circle"
              onClick={() => {
                navigate({
                  pathname: "/createCircle",
                  search: createSearchParams({ noRedirect: "true" }).toString(),
                });
              }}
            >
              add circle{" "}
              <FontAwesomeIcon
                className="rotate-45 ml-2"
                icon={faCircleXmark}
              />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
});

const MotionHomeState = motion(HomeState, {
  forwardMotionProps: true,
});

export default MotionHomeState;
