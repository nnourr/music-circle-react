import { motion } from "framer-motion";
import React from "react";
import { useUser } from "../../providers/user.provider";

const HomePage = React.forwardRef<HTMLDivElement>((_, ref) => {
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
          className="absolute text-white text-xl font-fancy"
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
          className="text-white text-xl font-fancy"
        >
          welcome to
        </motion.h1>
        <motion.h1
          initial={{
            opacity: 0,
          }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 3,
            duration: 1,
            ease: "easeIn",
          }}
          className="text-white text-2xl font-fancy"
        >
          Music Circle
        </motion.h1>
      </div>
    </motion.div>
  );
});

const MotionHomePage = motion(HomePage, {
  forwardMotionProps: true,
});

export default MotionHomePage;
