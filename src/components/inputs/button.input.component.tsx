import { motion } from "framer-motion";
import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  isDisabled?: boolean | undefined;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  isDisabled,
}) => {
  const btnSizes = {
    xl: "min-w-[20rem] lg:min-w-[24rem]",
  };

  const btnSize = btnSizes.xl;

  return (
    <motion.button
      className={`${btnSize} ${
        isDisabled ? "text-black/20" : "text-black/80"
      } relative text-center py-1 pb-0  text-lg lg:text-lg-lg border-black/10 border-2 rounded-3xl w-fit transition-all`}
      onClick={onClick}
      transition={{ duration: 0.4 }}
      whileTap={{ scale: 0.95 }}
      disabled={isDisabled}
      whileHover={
        isDisabled
          ? {}
          : {
              borderColor: "rgba(0,0,0,0.5)",
            }
      }
    >
      {children}
    </motion.button>
  );
};

export default Button;
