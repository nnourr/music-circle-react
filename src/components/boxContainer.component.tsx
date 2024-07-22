import { motion } from "framer-motion";
import { GRADIENT_END, GRADIENT_MIDDLE } from "../config/globals";
import { useIsMobile } from "../providers/isMobile.provider";

interface BoxContainerInterface {
  children: React.ReactNode;
  className?: string;
  motionKey?: string;
  forceVisible?: boolean;
}

export const BoxContainer: React.FC<BoxContainerInterface> = ({
  children,
  className,
  motionKey,
  forceVisible = undefined,
}) => {
  const isMobile = useIsMobile();
  const style =
    forceVisible === undefined
      ? `${className} lg:border-white/10 lg:bg-black/50 lg:border lg:rounded-[32px] lg:p-8`
      : forceVisible === true
      ? `${className} border-white/10 bg-black/50 border p-4`
      : `${className}`;

  return (
    <motion.div
      key={motionKey}
      className={style}
      whileHover={
        !isMobile && forceVisible === undefined
          ? {
              backgroundColor: "rgba(0,0,0,0.9)",
              borderColor: "rgba(255,255,255, 0.3)",
            }
          : {}
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
};
