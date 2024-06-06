import { motion } from "framer-motion";
import React, { useState } from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  iconPath?: string;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  const btnSizes = {
    xl: "min-w-[24rem] text-lg",
  };

  const btnSize = btnSizes.xl;

  return (
    <motion.button
      className={`${btnSize} px-14 relative text-center py-1 pb-0 text-base text-black/80 border-black/10 border-2 rounded-3xl`}
      onClick={onClick}
      animate={{ translateY: 0, opacity: 1 }}
      initial={{
        translateY: "100%",
        opacity: 0,
      }}
      transition={{ duration: 0.4 }}
      whileTap={{ scale: 0.95 }}
      whileHover={{
        borderColor: "rgba(0,0,0,0.5)",
      }}
      exit={{
        translateY: "-100%",
        opacity: 0,
      }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
