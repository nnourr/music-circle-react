import { AnimatePresence, motion } from "framer-motion";
import { UserCircle } from "../../../models/userCircle.model";
import { useIsMobile } from "../../../providers/isMobile.provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faArrowRightFromBracket,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Button, {
  btnSizes,
} from "../../../components/inputs/button.input.component";
import { useCallback, useState } from "react";
import { SERVER_ENDPOINT } from "../../../config/globals";
import { useUser } from "../../../providers/user.provider";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { useUserCircles } from "../../../providers/userCircles.provider";

interface HamburgerMenuProps {
  circles: UserCircle[];
  currentCircleCode: string | undefined;
  setCurrentCircle: (circleCode: string) => any;
  close: () => any;
}
export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  circles,
  currentCircleCode,
  close,
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { email } = useUser();
  const { userCircles, setUserCircles } = useUserCircles();
  const [, setSearchParams] = useSearchParams();
  const [circleToLeave, setCircleToLeave] = useState<UserCircle | undefined>();

  const leaveCircle = useCallback(
    async (circleCode: string) => {
      const addUserToCircleResponse = await fetch(
        `${SERVER_ENDPOINT}/user/${email}/circle/${circleCode}`,
        { method: "delete" }
      );
      if (addUserToCircleResponse.status !== 200) {
        console.error("unable to leave circle " + circleCode);
        return;
      }
      setCircleToLeave(undefined);
      setUserCircles(
        userCircles.filter((circle) => circle.circleCode !== circleCode)
      );
      if (circleCode === currentCircleCode) {
        navigate({
          pathname: "/home",
          search: createSearchParams({
            circleCode: circles[0].circleCode,
          }).toString(),
        });
      }
    },
    [circles, currentCircleCode, email, navigate, setUserCircles, userCircles]
  );

  const circleList = circles.map((circle) => {
    const isCurrentCircle = circle.circleCode === currentCircleCode;
    return (
      <Button
        title={`go to ${circle.circleName}`}
        btnSize={btnSizes.md}
        white={true}
        onClick={() => {}}
        className="w-full mb-3 overflow-hidden"
        key={circle.circleCode}
      >
        {isCurrentCircle ? (
          <div className="absolute top-0 left-0 w-full h-full opacity-40 bg-linear-gradient" />
        ) : (
          ""
        )}
        <div className="flex justify-between">
          <p
            onClick={() => {
              setSearchParams(
                createSearchParams({
                  circleCode: circle.circleCode,
                })
              );
              close();
            }}
            className="z-10 px-5 lg:px-7 text-left w-full relative"
          >
            {circle.circleName}
          </p>
          <FontAwesomeIcon
            icon={faCircleXmark}
            onClick={() => setCircleToLeave(circle)}
            className="z-10 relative px-5 pt-[4px] lg:pt-[6px] lg:px-7"
            title="Leave Circle"
          />
        </div>
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
      <AnimatePresence>
        {!!circleToLeave ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="leaveCircleModal"
            className="h-full w-full z-50 flex justify-center items-center absolute top-0 left-0"
          >
            <motion.div className="w-[90%] lg:w-[43rem] lg:h-80 border-white/50 border-4 bg-black rounded-3xl gap-12 px-6 lg:px-12 py-4 lg:py-8 flex flex-col justify-between">
              <h2 className="text-white text-1xl lg:text-lg-1xl leading-tight">
                Are you sure you want to leave{" "}
                <span className="bg-linear-gradient text-transparent bg-clip-text font-bold">
                  {circleToLeave?.circleName}
                </span>
                ?
              </h2>
              <div className="flex w-full flex-col lg:flex-row items-end justify-end gap-2 lg:gap-6">
                <Button
                  onClick={() => setCircleToLeave(undefined)}
                  title="Don't leave Circle"
                  white={true}
                  btnSize={btnSizes.md}
                  className=" !w-full lg:w-auto"
                >
                  No, Stay in Circle
                </Button>
                <Button
                  onClick={() => leaveCircle(circleToLeave.circleCode)}
                  title="Yes, leave Circle"
                  white={true}
                  btnSize={btnSizes.md}
                  className="overflow-hidden relative !w-full lg:w-auto"
                >
                  <div className="absolute top-0 left-0 w-full h-full opacity-40 bg-linear-gradient" />
                  <span className="relative z-20">Yes, Leave Circle</span>
                </Button>
              </div>
            </motion.div>
            <div
              className="h-full w-full -z-10 bg-black/60 absolute top-0 left-0"
              onClick={() => setCircleToLeave(undefined)}
            ></div>
          </motion.div>
        ) : (
          ""
        )}
      </AnimatePresence>
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

          <div className="flex w-full gap-4">
            <Button
              className="!w-2/3 !min-w-0"
              white={true}
              btnSize={btnSizes.md}
              title="Join or Create Circle"
              onClick={() => {
                navigate({
                  pathname: "/joinCircle",
                  search: createSearchParams({ noRedirect: "true" }).toString(),
                });
              }}
            >
              <FontAwesomeIcon icon={faAdd} />
            </Button>
            <Button
              title="Sign Out"
              className="!w-1/3 !min-w-0"
              white={true}
              btnSize={btnSizes.md}
              onClick={() => {
                localStorage.removeItem("user");
                window.location.reload();
              }}
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </Button>
          </div>
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
