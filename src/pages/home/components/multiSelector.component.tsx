import React, { useState, useEffect } from "react";
import { Variants, motion } from "framer-motion";
import {
  RADIAL_GRADIENT,
  RADIAL_GRADIENT_WHITE,
  SPOTIFY_GREEN,
} from "../../../config/globals";
import { cloneDeep } from "lodash";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface MultiSelectorProps {
  itemsData: string[];
  onSelectionChange: (selectedItems: string[]) => void;
  onClick?: () => any;
  className?: string;
  isCollapsible?: boolean;
  collapsibleTitle?: string;
}

const MultiSelector: React.FC<MultiSelectorProps> = ({
  itemsData,
  onSelectionChange,
  className,
  onClick,
  isCollapsible = false,
  collapsibleTitle,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(!isCollapsible);

  useEffect(() => {
    setSelectedItems(cloneDeep(itemsData));
  }, [itemsData]);

  useEffect(() => {
    onSelectionChange(selectedItems);
  }, [selectedItems, onSelectionChange]);

  const isSelected = (item: string) => selectedItems.includes(item);

  const handleSelectAll = () => {
    if (selectedItems.length === itemsData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(itemsData);
    }
  };

  const handleToggle = (item: string) => {
    if (isSelected(item)) {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem !== item)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const itemVariants: Variants = {
    unselected: {
      opacity: 0.7,
    },
    wiggle: (custom) => ({
      translateX: [null, "-10px", "15px", "0"],
      transition: { repeat: Infinity, repeatDelay: 1, delay: custom / 2 + 0.5 },
    }),
  };

  const circleVariants: Variants = {
    selected: { backgroundImage: RADIAL_GRADIENT },
    unselected: { backgroundImage: RADIAL_GRADIENT_WHITE },
    wiggle: { backgroundImage: RADIAL_GRADIENT_WHITE },
  };

  return (
    <motion.div
      className={`${className} inline-block bg-black border-2 rounded-2xl lg:rounded-3xl lg:overflow-hidden`}
      whileTap={isCollapsible && !isOpen ? { scale: 0.95 } : {}}
      initial={{
        borderColor: `rgba(255, 255, 255, 0.5)`,
      }}
      whileHover={{
        borderColor: `rgba(255, 255, 255, 0.8)`,
      }}
      animate={
        isCollapsible
          ? isOpen
            ? {
                width: "100%",
              }
            : { width: 0 }
          : {}
      }
    >
      {isCollapsible && (
        <motion.button
          title="Select Item"
          onClick={() => setIsOpen(!isOpen)}
          animate={{ opacity: isOpen && isCollapsible ? 1 : 0.9 }}
          className="text-left inline-flex items-center lg:font-bold justify-between lg:pt-2 px-4 py-2 gap-2 lg:gap-6 text-base lg:text-lg-xl text-white leading-none"
        >
          <span className="lg:bg-linear-gradient lg:bg-clip-text lg:text-transparent">
            {collapsibleTitle}
          </span>
          <FontAwesomeIcon
            className={`lg:text-spotify ${
              isOpen ? "" : "fa-rotate-90"
            } transition-all`}
            icon={faCaretDown}
          />
        </motion.button>
      )}
      <motion.div
        key="multiMultiSelector"
        layout
        className={`flex flex-col px-4 items-start text-sm font-normal overflow-clip h-full lg:text-base`}
        initial={
          isCollapsible
            ? { maxHeight: 0, opacity: 0, marginTop: 0, width: 0 }
            : { opacity: 1, marginTop: "0.75rem" }
        }
        animate={
          isCollapsible
            ? isOpen
              ? {
                  maxHeight: 2000,
                  opacity: 1,
                  width: "100%",
                }
              : { width: 0, maxHeight: 0 }
            : {}
        }
      >
        <motion.div
          onClick={handleSelectAll}
          className="flex items-center cursor-pointer mb-2"
          whileTap={{ scale: 0.9 }}
          custom={0}
          animate={
            selectedItems.length === itemsData.length
              ? "selected"
              : "unselected"
          }
          variants={itemVariants}
        >
          <motion.div
            variants={circleVariants}
            className="rounded-full aspect-square h-5"
          ></motion.div>
          <span className="ml-2 text-nowrap text-white">
            {selectedItems.length === itemsData.length && "de"}select all
            {selectedItems.length !== itemsData.length && (
              <span className="text-transparent">de</span>
            )}
          </span>
        </motion.div>
        <div className="w-full h-[1px] mb-2 bg-linear-gradient" />
        {itemsData.map((item, i) => (
          <motion.div
            key={item}
            onClick={() => handleToggle(item)}
            className="flex items-center cursor-pointer mb-2 text-white"
            whileTap={{ scale: 0.9 }}
            custom={i / 10}
            animate={
              isSelected(item)
                ? "selected"
                : selectedItems.length === 0
                ? "wiggle"
                : "unselected"
            }
            variants={itemVariants}
          >
            <motion.div
              variants={circleVariants}
              className="rounded-full aspect-square h-5"
            ></motion.div>
            <span className="ml-2 text-nowrap">{item}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default MultiSelector;
