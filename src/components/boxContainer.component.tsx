import { motion } from "framer-motion";
import { GRADIENT_END, GRADIENT_MIDDLE } from "../config/globals";

interface BoxContainerInterface {
  children: React.ReactNode;
  className?: string;
  key?: string;
}

export const BoxContainer: React.FC<BoxContainerInterface> = ({
  children,
  className,
  key,
}) => {
  return (
    <motion.div
      key={key}
      className={`${className} border-white/50 bg-black/50 border rounded-3xl lg:rounded-[32px] p-4 lg:p-8`}
      whileHover={{
        backgroundColor: "rgba(0,0,0,0.9)",
        borderColor: "rgba(255,255,255, 0.9)",
      }}
    >
      {children}
    </motion.div>
  );
};
