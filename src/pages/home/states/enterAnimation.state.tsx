import { motion } from "framer-motion";
import React from "react";
import { useUser } from "../../../providers/user.provider";
import {
  LINEAR_GRADIENT_BREATHE_1,
  LINEAR_GRADIENT_BREATHE_2,
} from "../../../config/globals";

const EnterAnimation = React.forwardRef<HTMLDivElement>((_, ref) => {
  const { username } = useUser();
  return (
    <motion.div
      ref={ref}
      className="h-full w-full flex justify-center items-center flex-col gap-12 lg:gap-24"
    >
      <div className="h-1/2 w-3/4 relative">
        <motion.h1
          initial={{
            opacity: 0,
          }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2, times: [0, 0.2, 0.8, 1], ease: "linear" }}
          className="absolute text-white leading-none text-xl font-fancy lg:text-lg-xl"
        >
          hey {username},
        </motion.h1>
        <motion.h1
          initial={{
            opacity: 0,
          }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 2,
            duration: 1,
            ease: "linear",
          }}
          className="text-white text-xl leading-none font-fancy lg:text-lg-xl"
        >
          welcome to
        </motion.h1>
        <motion.div
          className="bg-clip-text w-fit"
          animate={{
            opacity: 1,
          }}
          initial={{
            opacity: 0,
          }}
          transition={{
            delay: 2.5,
            duration: 1,
          }}
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
            className="text-transparent text-2xl lg:text-lg-2xl font-fancy bg-clip-text"
          >
            Music Circle
          </motion.h1>
        </motion.div>
      </div>
    </motion.div>
  );
});

const MotionEnterAnimation = motion(EnterAnimation, {
  forwardMotionProps: true,
});

export default MotionEnterAnimation;
