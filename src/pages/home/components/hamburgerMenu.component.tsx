import { motion } from "framer-motion";
import { UserCircle } from "../../../models/userCircle.model";
import { useIsMobile } from "../../../providers/isMobile.provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Button, {
  btnSizes,
} from "../../../components/inputs/button.input.component";

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
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  const circleList = circles.map((circle) => {
    const isCurrentCircle = circle.circleCode === currentCircleCode;
    return (
      <Button
        btnSize={btnSizes.md}
        white={true}
        onClick={() => {
          setSearchParams(
            createSearchParams({
              circleCode: circle.circleCode,
            })
          );
          close();
        }}
        className="w-full mb-3 overflow-hidden"
        key={circle.circleCode}
      >
        {isCurrentCircle ? (
          <div className="absolute top-0 left-0 w-full h-full opacity-40 bg-linear-gradient" />
        ) : (
          ""
        )}
        <p className="z-10 px-5 lg:px-7 text-left relative">
          {circle.circleName}
        </p>
      </Button>
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
        className="bg-black flex flex-col h-full px-8 lg:px-14 py-9"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="h-full flex flex-col items-start"
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
          <div className="overflow-y-auto h-full w-full">{circleList}</div>

          <Button
            className="w-full"
            white={true}
            btnSize={btnSizes.md}
            onClick={() => {
              navigate({
                pathname: "/joinCircle",
                search: createSearchParams({ noRedirect: "true" }).toString(),
              });
            }}
          >
            <FontAwesomeIcon icon={faAdd} />
          </Button>
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
