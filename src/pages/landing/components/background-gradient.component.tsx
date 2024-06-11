import React from "react";
import { motion } from "framer-motion";
import { RADIAL_GRADIENT, RADIAL_GRADIENT_ALT } from "../../../config/globals";

interface BackgroundGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: boolean;
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  error = false,
}) => {
  return (
    <motion.div
      animate={{
        backgroundImage: error
          ? "radial-gradient(50% 50% at 50% 50%, rgb(41 235 38) 0%, rgb(63 177 171) 20%, rgb(41 195 159) 100%)"
          : [RADIAL_GRADIENT_ALT, RADIAL_GRADIENT],
        transition: { repeat: Infinity, repeatType: "mirror", duration: 5 },
      }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="h-full w-full absolute top-0 left-0 -z-10 flex justify-center items-center overflow-hidden"
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
