import React from "react";
import { motion } from "framer-motion";

interface BackgroundGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  alt: boolean;
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = (
  props
) => {
  return (
    <motion.div
      animate={{
        backgroundImage: props.alt
          ? "radial-gradient(50% 50% at 50% 50%, #4BE048 0%, #5EC8AF 70%, #75ABA8 100%)"
          : "radial-gradient(50% 50% at 50% 50%, #4BE048 0%, #75ABA8 70%, #5EC8AF 100%)",
      }}
      transition={{ duration: 0.4 }}
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
