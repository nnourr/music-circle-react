import React from "react";
import { motion } from "framer-motion";

interface BackgroundGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  alt?: boolean;
  error?: boolean;
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  alt = false,
  error = false,
}) => {
  return (
    <motion.div
      animate={{
        backgroundImage: error
          ? "radial-gradient(50% 50% at 50% 50%, rgb(41 235 38) 0%, rgb(63 177 171) 20%, rgb(41 195 159) 100%)"
          : alt
          ? "radial-gradient(50% 50% at 50% 50%, rgb(41 235 38) 0%, rgb(41 195 159) 70%, rgb(63 177 171) 100%)"
          : "radial-gradient(50% 50% at 50% 50%, rgb(41 235 38) 0%, rgb(63 177 171) 70%, rgb(41 195 159) 100%)",
      }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="h-full w-full absolute top-0 left-0 -z-10 flex justify-center items-center overflow-hidden"
      initial={false}
    >
      <motion.div
        className="border-green-800/30 border-[20px] h-0 w-0 rounded-[50%] blur-3xl absolute"
        animate={{ width: "150%", height: "150%" }}
        transition={{ duration: 5, repeat: Infinity }}
      ></motion.div>
    </motion.div>
  );
};

export default BackgroundGradientProps;
