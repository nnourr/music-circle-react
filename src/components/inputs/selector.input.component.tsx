import { faCaretDown, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Button, { btnSizes } from "./button.input.component";
import { useIsMobile } from "../../providers/isMobile.provider";
import { motion } from "framer-motion";
import { LINEAR_GRADIENT, LINEAR_GRADIENT_WHITE } from "../../config/globals";

interface Option {
  label: string;
  value: string;
}

interface SelectorProps {
  options: Option[];
  defaultValue?: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Selector: React.FC<SelectorProps> = ({
  options,
  defaultValue,
  onChange,
  className,
}) => {
  const [selectedValue, setSelectedValue] = useState(
    defaultValue || options[0].value
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSelection = (value: string) => {
    setSelectedValue(value);
    onChange(value);
    setIsOpen(false);
  };

  const selectedLabel = options.find(
    (option) => option.value === selectedValue
  )?.label;

  return (
    <motion.div
      className={`pt-1 inline-block px-2 lg:px-4 bg-black border-2 w-fit rounded-2xl lg:rounded-3xl`}
      whileTap={{ scale: 0.95 }}
      initial={{
        borderColor: `rgba(255, 255, 255, 0.5)`,
      }}
      whileHover={{
        borderColor: `rgba(255, 255, 255, 0.8)`,
      }}
    >
      <button
        title="Select Item"
        className="inline-block"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="inline-flex items-center font-bold opacity-80 justify-between gap-2 lg:gap-6 text-1xl lg:text-lg-xl bg-linear-gradient bg-clip-text text-transparent leading-none">
          <span>{selectedLabel}</span>
          <FontAwesomeIcon
            className={`text-spotify ${
              isOpen ? "" : "fa-rotate-90"
            } transition-all`}
            icon={faCaretDown}
          />
        </span>
      </button>
      <motion.div
        layout
        initial={{ height: 0 }}
        animate={{ height: isOpen ? "fit-content" : 0 }}
        className="w-full text-left font-bold text-1xl lg:text-lg-xl leading-none overflow-hidden"
      >
        <div className="w-full h-[1px] bg-linear-gradient mb-2" />
        <ul className="py-1">
          {options.map((option) =>
            option.value === selectedValue ? (
              ""
            ) : (
              <motion.li
                key={option.value}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 0.8,
                }}
                whileHover={{
                  opacity: 1,
                }}
                className="text-white"
              >
                <button
                  type="button"
                  title={`Select ${option.label}`}
                  onClick={() => handleSelection(option.value)}
                >
                  {option.label}
                </button>
              </motion.li>
            )
          )}
        </ul>
      </motion.div>
    </motion.div>
  );
};
