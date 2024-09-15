import {
  faCircleXmark,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Button from "../../../components/inputs/button.input.component";
import { useUserCircles } from "../../../providers/userCircles.provider";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { ModalComponent } from "../../../components/modal.component";
import { UserCircle } from "../../../models/userCircle.model";
import { SERVER_ENDPOINT } from "../../../config/globals";
import { useUser } from "../../../providers/user.provider";
import Input from "../../../components/inputs/text.input.component";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

interface UserCircleListComponentProps {
  currentCircleCode?: string;
  onCircleClick?: () => any;
  className?: string;
  btnSize: string;
}

export const UserCircleListComponent: React.FC<
  UserCircleListComponentProps
> = ({ currentCircleCode, className, onCircleClick, btnSize }) => {
  const { userCircles, setUserCircles } = useUserCircles();
  const [, setSearchParams] = useSearchParams();
  const [circleToLeave, setCircleToLeave] = useState<UserCircle | undefined>();
  const [circleToEdit, setCircleToEdit] = useState<UserCircle | undefined>();
  const [circleNameError, setCircleNameError] = useState<string | undefined>();
  const [circleMenuOpen, setCircleMenuOpen] = useState<number | undefined>();
  const [newCircleName, setNewCircleName] = useState<string>("");
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
      const newUserCircles = userCircles.filter(
        (circle) => circle.circleCode !== circleCode
      );
      setUserCircles(newUserCircles);
      if (circleCode === currentCircleCode) {
        if (newUserCircles.length === 0) {
          navigate("/createCircle");
          return;
        }
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

  const renameCircle = useCallback(async () => {
    if (!!!circleToEdit) {
      return;
    }
    const trimmedCircleName = newCircleName.trim();
    if (trimmedCircleName.length === 0) {
      setCircleNameError("circle name cannot be empty");
      return;
    }

    if (!!circleNameError) {
      return;
    }

    const renameCircleResponse = await fetch(
      `${SERVER_ENDPOINT}/circle/${circleToEdit?.circleCode}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newCircleName: trimmedCircleName }),
      }
    );
    if (renameCircleResponse.status !== 200) {
      console.error("unable to rename circle " + circleToEdit?.circleCode);
      setCircleNameError("unable to rename circle");
      return;
    }
    setCircleToEdit(undefined);
    setUserCircles(
      userCircles.map((circle) => {
        if (circle.circleCode === circleToEdit?.circleCode) {
          circle.circleName = trimmedCircleName;
        }
        return circle;
      })
    );
    if (!!currentCircleCode && circleToEdit?.circleCode !== currentCircleCode) {
      navigate({
        pathname: "/home",
        search: createSearchParams({
          circleCode: circleToEdit?.circleCode,
        }).toString(),
      });
    }
  }, [
    circleToEdit,
    newCircleName,
    circleNameError,
    setUserCircles,
    userCircles,
    currentCircleCode,
    navigate,
  ]);

  useEffect(() => {
    setCircleNameError(undefined);
    const trimmedCircleCode = newCircleName.trim();
    setNewCircleName(trimmedCircleCode);

    const invalidCodePattern = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
    if (invalidCodePattern.test(trimmedCircleCode)) {
      setCircleNameError("sorry, no special characters.");
      return;
    }
  }, [newCircleName]);

  const leaveCircleModalText: ReactNode = (
    <span>
      Are you sure you want to leave{" "}
      <span className="bg-linear-gradient text-transparent bg-clip-text font-bold">
        {circleToLeave?.circleName}
      </span>
      ?
    </span>
  );

  const editCircleModalText: ReactNode = (
    <span>
      Rename{" "}
      <span className="bg-linear-gradient text-transparent bg-clip-text font-bold">
        {circleToEdit?.circleName}
      </span>
      :
      {!!circleNameError && (
        <p className="text-base absolute lg:text-lg-base text-error">
          {circleNameError}
        </p>
      )}
      <Input
        maxLength={16}
        onChange={(change) => setNewCircleName(change.target.value)}
        onEnter={renameCircle}
        placeholder="enter circle name"
        white={true}
        error={!!circleNameError}
        className="mt-8 w-full"
      ></Input>
    </span>
  );

  const circleList = userCircles.map((circle, i) => {
    const isCurrentCircle = circle.circleCode === currentCircleCode;
    return (
      <Button
        title={`go to ${circle.circleName}`}
        btnSize={btnSize}
        white={true}
        onClick={() => {}}
        className="w-full mb-3"
        key={circle.circleCode}
      >
        {isCurrentCircle ? (
          <div className="absolute top-0 left-0 w-full h-full opacity-40 bg-linear-gradient rounded-xl" />
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
            className="z-10 pl-5 lg:pl-7 flex-shrink-1 overflow-hidden text-ellipsis text-left w-full relative"
          >
            {circle.circleName}
          </p>
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            className="z-10 relative px-5 pt-[4px] lg:pt-[6px] lg:px-7"
            onClick={() => setCircleMenuOpen(i)}
          />
        </div>
        {circleMenuOpen === i && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute right-0 top-0 z-10 outline-2 outline-white outline rounded-2xl px-4 bg-black flex gap-4 h-full items-center"
          >
            <FontAwesomeIcon
              icon={faPenToSquare}
              onClick={() => setCircleToEdit(circle)}
              className="z-10"
              title="Rename Circle"
            />
            <FontAwesomeIcon
              icon={faCircleXmark}
              onClick={() => setCircleToLeave(circle)}
              className="z-10"
              title="Leave Circle"
            />
          </motion.div>
        )}
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
        {circleToEdit && (
          <ModalComponent
            cancelAction={{
              actionText: "Cancel",
              actionTitle: "I do not want to rename this circle",
              onAction: () => {
                setCircleToEdit(undefined);
              },
            }}
            confirmAction={{
              actionText: "Confirm",
              actionTitle: "I want to rename this Circle",
              onAction: renameCircle,
            }}
            promptText={editCircleModalText}
            onClose={() => setCircleToEdit(undefined)}
            key={"RenameCircleModal"}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
