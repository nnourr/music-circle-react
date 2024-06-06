import { motion } from "framer-motion";

interface SquirlComponentProps {
  yOffset?: string;
  flip?: boolean;
  className?: string;
}

export const SquirlComponent: React.FC<SquirlComponentProps> = ({
  yOffset,
  flip,
  className,
}) => {
  return (
    <motion.div
      className={`${className}`}
      initial={false}
      animate={{
        scaleX: flip ? -1 : 1,
        translateY: yOffset,
      }}
      transition={{ duration: 0.5 }}
    >
      <svg
        className="absolute scale-90 origin-top"
        xmlns="http://www.w3.org/2000/svg"
        width="158"
        height="2171"
        viewBox="0 0 158 2171"
        fill="none"
      >
        <path
          d="M77.9761 2C135.309 51.1667 215.576 170.5 77.9761 302.5C-59.6239 434.5 20.6427 583.167 77.9761 641C125.976 694.833 193.176 825.1 77.9761 915.5C-37.2239 1005.9 32.5 1066.5 75.5 1088.5C142.739 1122.9 215.576 1254 77.9761 1386C-59.6239 1518 20.6427 1666.67 77.9761 1724.5C125.976 1778.33 193.176 1908.6 77.9761 1999C-37.2239 2089.4 29.9761 2150 77.9761 2169"
          stroke="black"
          strokeWidth="3"
        />
      </svg>
    </motion.div>
  );
};
