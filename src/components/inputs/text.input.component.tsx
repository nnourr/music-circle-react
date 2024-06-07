import { motion } from "framer-motion";
import React from "react";

interface InputProps {
  onChange: (change: any) => void;
  children: React.ReactNode;
  placeholder: string | undefined;
  className?: string;
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({
  onChange,
  children,
  error,
  placeholder,
}) => {
  const size = {
    xl: "min-w-[24rem] text-lg",
  };

  const inputSize = size.xl;

  return (
    <motion.div
      className={`${inputSize} px-14 relative text-center py-1 pb-0 text-base text-black/80 border-black/10 border-2 rounded-3xl`}
      animate={
        error
          ? {
              translateY: 0,
              opacity: 1,
              color: "rgba(200 0 0 0.8)",
              borderColor: "rgba(200 0 0 0.8)",
            }
          : { translateY: 0, opacity: 1 }
      }
      transition={{ duration: 0.4 }}
      whileTap={{ scale: 0.95 }}
      whileHover={
        error
          ? {
              borderColor: "rgba(200 0 0 0.8)",
            }
          : { borderColor: "rgba(0 0 0 0.5)" }
      }
    >
      {children}
      <input
        type="text"
        onChange={onChange}
        placeholder={placeholder}
        className="bg-transparent placeholder:text-black/50 focus:outline-none w-[7em]"
      ></input>
    </motion.div>
  );
};

export default Input;
