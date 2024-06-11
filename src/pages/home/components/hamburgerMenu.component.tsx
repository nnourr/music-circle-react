import { motion } from "framer-motion";
import { UserCircle } from "../../../models/userCircle.model";
import { useIsMobile } from "../../../providers/isMobile.provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";

interface HamburgerMenuProps {
  circles: UserCircle[];
  currentCircleCode: string | undefined;
  setCurrentCircle: (circleCode: string) => any;
  close: () => any;
}
export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  circles,
  setCurrentCircle,
  currentCircleCode,
  close,
}) => {
  const isMobile = useIsMobile();

  const circleList = circles.map((circle) => {
    const isCurrentCircle = circle.circleCode === currentCircleCode;
    return (
      <motion.button
        className="text-base lg:text-lg-base relative text-start mb-2 lg:mb-3 px-5 lg:px-7 pt-1 w-full rounded-2xl border-2 text-white border-white/70 hover:border-white transition-all overflow-hidden"
        onClick={() => {
          setCurrentCircle(circle.circleCode);
          close();
        }}
        key={circle.circleCode}
      >
        {isCurrentCircle ? (
          <div className="absolute top-0 left-0 w-full h-full opacity-40 bg-linear-gradient" />
        ) : (
          ""
        )}
        <p className="relative">{circle.circleName}</p>
      </motion.button>
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: [null, 0] }}
      className="h-full w-full z-50 bg-black/60 absolute top-0 left-0"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: isMobile ? "100%" : "34rem" }}
        className="bg-black h-full px-8 lg:px-14 py-9"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button onClick={close} className="absolute left-5 top-2 w-7 h-7" />
          <button onClick={close}>
            <FontAwesomeIcon
              icon={faClose}
              className="text-white/90 text-lg lg:text-lg-lg"
            />
          </button>
          <h2 className="bg-linear-gradient my-4 bg-clip-text leading-[1] font-fancy text-transparent text-xl lg:text-lg-xl">
            Your Circles
          </h2>
          {circleList}
          <motion.button
            className="text-base lg:text-lg-base relative text-center px-5 pt-1 w-full rounded-2xl border-2 text-white border-white/70 hover:border-white transition-all overflow-hidden"
            onClick={() => {
              console.log("add a circle!");
            }}
          >
            <FontAwesomeIcon icon={faAdd} />
          </motion.button>
        </motion.div>
      </motion.div>
      <motion.div
        key="gradient menu background"
        className="h-full w-full bg-linear-gradient opacity-60 -z-10 absolute top-0 left-0"
        onClick={close}
      ></motion.div>
    </motion.div>
  );
};
