import { motion } from "framer-motion";
import { GRADIENT_END, GRADIENT_MIDDLE } from "../config/globals";
import { useIsMobile } from "../providers/isMobile.provider";

interface BoxContainerInterface {
  children: React.ReactNode;
  className?: string;
  key?: string;
  forceVisible?: boolean;
}

export const BoxContainer: React.FC<BoxContainerInterface> = ({
  children,
  className,
  key,
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
      key={key}
      className={style}
      whileHover={
        !isMobile && forceVisible === undefined
          ? {
              backgroundColor: "rgba(0,0,0,0.9)",
              borderColor: "rgba(255,255,255, 0.3)",
            }
          : {}
      }
    >
      {children}
    </motion.div>
  );
};
