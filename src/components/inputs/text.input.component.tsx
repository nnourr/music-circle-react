import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useIsMobile } from "../../providers/isMobile.provider";

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
    xl: "w-[20rem] lg:w-auto",
  };

  const inputSize = size.xl;
  const [onFocus, setOnFocus] = useState<boolean>(false);
  const isMobile = useIsMobile();

  return (
    <motion.div
      className={`${inputSize} lg:px-14 flex justify-center items-center relative text-center py-1 pb-0 text-lg lg:text-lg-lg text-black/80 border-black/50 border-b-2 lg:border-2 lg:rounded-3xl`}
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
              borderColor: onFocus ? "rgba(0 0 0 0.5)" : "rgba(0 0 0 0.1)",
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
          className={`animate-spin my-2 w-[12.3em]`}
          icon={faSpinner}
        />
      ) : (
        <>
          {!isMobile ? children : undefined}
          <input
            type="text"
            onChange={onChange}
            placeholder={placeholder}
            maxLength={maxLength}
            onFocus={() => setOnFocus(true)}
            onBlur={() => setOnFocus(false)}
            className="bg-transparent placeholder:text-black/30 text-center w-full lg:text-left focus:outline-none lg:w-[7em]"
          ></input>
        </>
      )}
    </motion.div>
  );
};

export default Input;
