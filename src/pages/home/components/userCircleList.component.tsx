import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Button from "../../../components/inputs/button.input.component";
import { useUserCircles } from "../../../providers/userCircles.provider";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useCallback, useState } from "react";
import { ModalComponent } from "../../../components/modal.component";
import { UserCircle } from "../../../models/userCircle.model";
import { SERVER_ENDPOINT } from "../../../config/globals";
import { useUser } from "../../../providers/user.provider";
import { faCircle } from "@fortawesome/free-regular-svg-icons";

interface UserCircleListComponentProps {
  currentCircleCode?: string;
  onCircleClick?: () => any;
  className?: string;
  btnSize: string;
  showAddCircle?: boolean;
}

export const UserCircleListComponent: React.FC<
  UserCircleListComponentProps
> = ({
  currentCircleCode,
  className,
  onCircleClick,
  btnSize,
  showAddCircle = false,
}) => {
  const { userCircles, setUserCircles } = useUserCircles();
  const [, setSearchParams] = useSearchParams();
  const [circleToLeave, setCircleToLeave] = useState<UserCircle | undefined>();
  const navigate = useNavigate();
  const { userId } = useUser();

  const leaveCircle = useCallback(
    async (circleCode: string) => {
      const addUserToCircleResponse = await fetch(
        `${SERVER_ENDPOINT}/user/${userId}/circle/${circleCode}`,
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
            circleCode: userCircles[0].circleCode,
          }).toString(),
        });
      }
    },
    [currentCircleCode, userId, navigate, setUserCircles, userCircles]
  );

  const leaveCircleModalText: ReactNode = (
    <span>
      Are you sure you want to leave{" "}
      <span className="bg-linear-gradient text-transparent bg-clip-text font-bold">
        {circleToLeave?.circleName}
      </span>
      ?
    </span>
  );

  const circleList = userCircles.map((circle) => {
    const isCurrentCircle = circle.circleCode === currentCircleCode;
    return (
      <Button
        title={`go to ${circle.circleName}`}
        btnSize={btnSize}
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
              if (!!onCircleClick) {
                onCircleClick();
              }
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
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {circleList}
      {showAddCircle && (
        <Button
          className="w-full mb-3"
          white={true}
          btnSize={btnSize}
          title="Join or Create Circle"
          onClick={() => {
            navigate({
              pathname: "/joinCircle",
              search: createSearchParams({ noRedirect: "true" }).toString(),
            });
          }}
        >
          <FontAwesomeIcon icon={faCircle} />
        </Button>
      )}
      <AnimatePresence>
        {circleToLeave && (
          <ModalComponent
            cancelAction={{
              actionText: "No, Stay in Circle",
              actionTitle: "I do not want to leave this circle",
              onAction: () => {
                setCircleToLeave(undefined);
              },
            }}
            confirmAction={{
              actionText: "Yes, Leave Circle",
              actionTitle: "I want to leave this Circle",
              onAction: () => {
                leaveCircle(circleToLeave.circleCode);
              },
            }}
            promptText={leaveCircleModalText}
            onClose={() => setCircleToLeave(undefined)}
            key={"LeaveCircleModal"}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
