import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React from "react";

interface InputProps {
  onChange: (change: any) => void;
  children: React.ReactNode;
  placeholder: string;
  className?: string;
  error?: boolean;
  isLoading?: boolean;
  maxLength?: number;
}

export const Input: React.FC<InputProps> = ({
  onChange,
  children,
  error,
  placeholder = "this is a placeholder!",
  maxLength = 20,
  isLoading,
}) => {
  const size = {
    xl: "min-w-[24rem] text-lg",
  };

  const inputSize = size.xl;

  return (
    <motion.div
      className={`${inputSize} px-14 relative text-center py-1 pb-0 text-base text-black/80 border-black/50 border-2 rounded-3xl`}
      animate={
        error
          ? {
              translateY: 0,
              opacity: 1,
              color: "rgba(227 0 73 0.9)",
              borderColor: "rgba(227 0 73 0.9)",
            }
          : {
              translateY: 0,
              opacity: 1,
              borderColor: "rgba(0 0 0 0.1)",
            }
      }
      transition={{ duration: 0.4 }}
      whileTap={{ scale: 0.95 }}
      whileHover={
        error
          ? {
              borderColor: "rgba(227 0 73 0.9)",
            }
          : { borderColor: "rgba(0 0 0 0.5)" }
      }
    >
      {isLoading ? (
        <FontAwesomeIcon
          className={`animate-spin w-[12.3em]`}
          icon={faSpinner}
        />
      ) : (
        <>
          {children}
          <input
            type="text"
            onChange={onChange}
            placeholder={placeholder}
            maxLength={maxLength}
            className="bg-transparent placeholder:text-black/30 focus:outline-none w-[7em]"
          ></input>
        </>
      )}
    </motion.div>
  );
};

export default Input;
