import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { motion } from "framer-motion";

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
      className={`${className} inline-block lg:static bg-black border-2 w-fit rounded-2xl lg:rounded-3xl lg:overflow-hidden`}
      whileTap={{ scale: 0.95 }}
      initial={{
        borderColor: `rgba(255, 255, 255, 0.5)`,
      }}
      whileHover={{
        borderColor: `rgba(255, 255, 255, 0.8)`,
      }}
    >
      <motion.button
        title="Select Item"
        onClick={() => setIsOpen(!isOpen)}
        animate={{ opacity: isOpen ? 1 : 0.8 }}
        className="w-full text-left inline-flex items-start lg:font-bold justify-between px-4 py-2 gap-2 lg:gap-6 text-base lg:text-lg-xl text-white leading-none"
      >
        <span className="lg:bg-linear-gradient lg:bg-clip-text lg:text-transparent">
          {selectedLabel}
        </span>
        <FontAwesomeIcon
          className={`lg:text-spotify ${
            isOpen ? "" : "fa-rotate-90"
          } transition-all`}
          icon={faCaretDown}
        />
      </motion.button>
      <motion.div
        layout
        initial={{ height: 0, opacity: 0 }}
        animate={isOpen ? { height: "fit-content", opacity: 1 } : {}}
        className="w-full bg-black rounded-b-2xl px-4 lg:font-bold text-base lg:text-lg-xl"
      >
        <div className="w-full h-[1px] bg-linear-gradient" />
        <ul>
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
                  className="h-full w-full py-1 text-left"
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
