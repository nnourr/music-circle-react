import { motion } from "framer-motion";
import React from "react";

interface InputProps {
  onChange: (change: any) => void;
  children: React.ReactNode;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ onChange, children }) => {
  const size = {
    xl: "min-w-[24rem] text-lg",
  };

  const inputSize = size.xl;

  return (
    <motion.div
      className={`${inputSize} px-14 relative text-center py-1 pb-0 text-base text-black/80 border-black/10 border-2 rounded-3xl`}
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
      <input
        type="text"
        onChange={onChange}
        placeholder="jknsutlaneyfligk"
        className="bg-transparent placeholder:text-black/50 focus:outline-none w-[7em]"
      ></input>
    </motion.div>
  );
};

export default Input;
