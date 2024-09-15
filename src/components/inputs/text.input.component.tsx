import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useIsMobile } from "../../providers/isMobile.provider";

interface InputProps {
  onChange: (change: any) => void;
  onEnter: () => void;
  children?: React.ReactNode;
  placeholder: string;
  className?: string;
  error?: boolean;
  isLoading?: boolean;
  maxLength?: number;
  white?: boolean;
}

export const Input: React.FC<InputProps> = ({
  onChange,
  onEnter,
  children,
  error,
  placeholder = "this is a placeholder!",
  maxLength = 20,
  isLoading,
  white = false,
  className,
}) => {
  const size = {
    xl: "w-[20rem] lg:w-auto",
  };

  const inputSize = size.xl;
  const [onFocus, setOnFocus] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const tailwindDynamicStyles = {
    text: white
      ? {
          disabled: "text-white/20",
          active: "text-white/90",
          placeholder: "placeholder:text-white/20",
        }
      : {
          disabled: "text-black/20",
          active: "text-black/80",
          placeholder: "placeholder:text-black/20",
        },
    inputAlign: isMobile || !!!children ? "text-center" : "text-left",
  };
  const motionColour = white ? "255, 255, 255" : "0, 0, 0";

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onEnter();
    }
  };

  return (
    <motion.div
      className={`${inputSize} ${tailwindDynamicStyles.text.active} ${className} lg:px-14 flex justify-center items-center relative text-center lg:pt-1 text-lg lg:text-lg-lg text-black/80 border-b-2 lg:border-2 lg:rounded-3xl`}
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
              borderColor: onFocus
                ? `rgba(${motionColour}, ${white ? "0.8" : "0.5"})`
                : `rgba(${motionColour}, ${white ? "0.5" : "0.1"})`,
            }
      }
      transition={{ duration: 0.4 }}
      whileTap={{ scale: 0.95 }}
      whileHover={
        error
          ? {
              borderColor: "rgba(227 0 73 0.9)",
            }
          : { borderColor: `rgba(${motionColour}, ${white ? "0.8" : "0.5"})` }
      }
    >
      {isLoading ? (
        <FontAwesomeIcon
          className={`my-2 w-[12.3em]`}
          icon={faSpinner}
          spinPulse
        />
      ) : (
        <>
          <span className="text-nowrap">{!isMobile && children}</span>
          <input
            type="text"
            onChange={onChange}
            placeholder={placeholder}
            maxLength={maxLength}
            onFocus={() => setOnFocus(true)}
            onBlur={() => setOnFocus(false)}
            onKeyDown={handleKeyDown}
            className={`bg-transparent ${tailwindDynamicStyles.text.placeholder} ${tailwindDynamicStyles.inputAlign} w-full text-nowrap focus:outline-none lg:w-[8em]`}
          ></input>
        </>
      )}
    </motion.div>
  );
};

export default Input;
