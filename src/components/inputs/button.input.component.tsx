import { motion } from "framer-motion";
import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  white?: boolean | undefined;
  isDisabled?: boolean | undefined;
  btnSize?: string;
}

export const btnSizes = {
  xl: "min-w-[20rem] lg:min-w-[24rem] text-lg lg:text-lg-lg",
  md: "min-w-[10rem] lg:min-w-[16rem] text-base lg:text-lg-base",
};

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  isDisabled,
  white,
  className,
  btnSize = btnSizes.xl,
}) => {
  const tailwindColour = {
    text: white
      ? { disabled: "text-white/20", active: "text-white/80" }
      : { disabled: "text-black/20", active: "text-black/80" },
    borderColour: white ? "border-white/10" : "border-black/10",
  };
  const motionColour = white ? "255, 255, 255" : "0,0,0";
  return (
    <motion.button
      className={`${btnSize} ${className} ${
        isDisabled
          ? `${tailwindColour.text.disabled}`
          : `${tailwindColour.text.active}`
      } relative text-center py-1 pb-0 border-2 rounded-3xl w-fit transition-all`}
      onClick={onClick}
      transition={{ duration: 0.1 }}
      whileTap={{ scale: 0.95 }}
      disabled={isDisabled}
      initial={{ borderColor: `rgba(${motionColour},0.1)` }}
      whileHover={
        isDisabled
          ? {}
          : {
              borderColor: `rgba(${motionColour},0.5)`,
            }
      }
    >
      {children}
    </motion.button>
  );
};

export default Button;
