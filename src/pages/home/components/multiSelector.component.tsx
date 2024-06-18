import React, { useState, useEffect } from "react";
import { Variants, motion } from "framer-motion";
import {
  LINEAR_GRADIENT,
  LINEAR_GRADIENT_WHITE,
  RADIAL_GRADIENT,
  RADIAL_GRADIENT_WHITE,
} from "../../../config/globals";
import { cloneDeep } from "lodash";

interface MultiSelectorProps {
  itemsData: string[];
  onSelectionChange: (selectedItems: string[]) => void;
  onClick?: () => any;
  className?: string;
}

const MultiSelector: React.FC<MultiSelectorProps> = ({
  itemsData,
  onSelectionChange,
  className,
  onClick,
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
    selected: (custom) => ({
      transition: { delay: custom },
      backgroundImage: LINEAR_GRADIENT,
    }),
    unselected: (custom) => ({
      transition: { delay: custom },
      backgroundImage: LINEAR_GRADIENT_WHITE,
    }),
    wiggle: (custom) => ({
      backgroundImage: [LINEAR_GRADIENT_WHITE, LINEAR_GRADIENT_WHITE],
      translateX: [null, "-10px", "20px", "0"],

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
      key="multiMultiSelector"
      className={`${className} flex flex-col items-start text-sm font-bold opacity-90 lg:text-lg-sm w-fit`}
      onClick={onClick}
    >
      <motion.div
        onClick={handleSelectAll}
        className="flex items-center cursor-pointer mb-2 bg-clip-text text-transparent"
        whileTap={{ scale: 0.9 }}
        custom={0}
        animate={
          selectedItems.length === itemsData.length ? "selected" : "unselected"
        }
        variants={itemVariants}
      >
        <motion.div
          variants={circleVariants}
          className="rounded-full aspect-square h-5"
        ></motion.div>
        <span className="ml-2">select all</span>
      </motion.div>
      <div className="w-full h-[1px] bg-linear-gradient mb-2" />
      {itemsData.map((item, i) => (
        <motion.div
          key={item}
          onClick={() => handleToggle(item)}
          className="flex items-center cursor-pointer mb-2 bg-clip-text text-transparent"
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
          <span className="ml-2">{item}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MultiSelector;