import { AnimatePresence, motion } from "framer-motion";
import { CompatibilityResult } from "../helpers/getCircleCompatibility";
import { useIsMobile } from "../../../providers/isMobile.provider";
import { UserInterface } from "../models/user.model";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsSpin, faRotateRight } from "@fortawesome/free-solid-svg-icons";

interface CircleCompatibilityProps {
  circleCompatibilityData: CompatibilityResult | undefined;
  users: UserInterface[];
  className?: string;
}

export const CircleCompatibility: React.FC<CircleCompatibilityProps> = ({
  circleCompatibilityData,
  className,
  users,
}) => {
  const isMobile = useIsMobile();
  const [unSelectedUsers, setUnSelectedUsers] =
    useState<UserInterface[]>(users);
  const [selectedUsers, setSelectedUsers] = useState<UserInterface[]>([]);

  if (
    !!!circleCompatibilityData ||
    isNaN(circleCompatibilityData.groupCompatibility)
  ) {
    return (
      <>
        {isMobile ? (
          <h2 className={`${className} text-lg lg:text-lg-lg text-white`}>
            Please select a member
          </h2>
        ) : (
          <h2 className="text-lg lg:block w-min font-bold text-nowrap lg:text-lg-lg text-transparent leading-none relative after:w-full after:h-full after:animate-pulse after:absolute after:top-0 after:right-0 after:bg-spotify/15 after:rounded-3xl after:block">
            circle compatibility
          </h2>
        )}
      </>
    );
  }

  const userPopularityRanking = circleCompatibilityData.compatibilityMatrix.map(
    (pairwiseCompatibility, i) => (
      <li
        className="text-base lg:text-base text-white"
        key={`${pairwiseCompatibility.user1Name}+${pairwiseCompatibility.user2Name}`}
      >
        {i + 1}. {pairwiseCompatibility.user1Name} x{" "}
        {pairwiseCompatibility.user2Name}:{" "}
        <span className="bg-linear-gradient bg-clip-text text-transparent">
          {pairwiseCompatibility.compatibilityPercentage}
        </span>
        %
      </li>
    )
  );

  const isFirstTime = localStorage.getItem("firstTime") === "true";

  const selectUser = (selectedUser: UserInterface) => {
    setSelectedUsers([...selectedUsers, selectedUser]);
    setUnSelectedUsers(
      unSelectedUsers.filter((user) => user.username !== selectedUser.username)
    );
  };

  const deselectUser = (unSelectedUser: UserInterface) => {
    setUnSelectedUsers([...unSelectedUsers, unSelectedUser]);
    setSelectedUsers(
      selectedUsers.filter((user) => user.username !== unSelectedUser.username)
    );
  };

  const resetSelectedUsers = () => {
    setUnSelectedUsers(users);
    setSelectedUsers([]);
  };

  const makeUserBubble = (user: UserInterface) => (
    <div className="w-full rounded-full">
      {user.images.length > 0 ? (
        <img
          src={user.images[0]}
          className="w-full rounded-full aspect-square"
        />
      ) : (
        <div className="bg-radial-gradient w-full rounded-full aspect-square"></div>
      )}
      <p className="text-base text-center text-white overflow-hidden overflow-ellipsis">
        {user.username}
      </p>
    </div>
  );

  return (
    <motion.div
      key="circleCompatibilityData"
      className={`${className} font-bold text-left flex-grow flex-shrink overflow-hidden flex flex-col`}
      initial={{ opacity: 0 }}
      animate={{
        opacity:
          circleCompatibilityData.compatibilityMatrix.length === 0 ? 0 : 0.8,
      }}
    >
      <h2 className="text-lg hidden lg:block w-min text-nowrap lg:text-lg-lg bg-linear-gradient bg-clip-text text-transparent leading-none">
        circle compatibility
      </h2>
      {isFirstTime && (
        <span className="text-white text-sm lg:text-base font-normal">
          (this is the circle's compatibility)
        </span>
      )}
      <h2 className="text-xl lg:ml-4 w-fit lg:text-lg-lg text-white">
        <span className="bg-linear-gradient font-bold bg-clip-text text-transparent">
          {circleCompatibilityData.groupCompatibility}
        </span>
        %
      </h2>
      <p className="text-lg lg:text-lg font-bold bg-linear-gradient bg-clip-text text-transparent w-fit">
        select members
      </p>
      <AnimatePresence mode="popLayout">
        {selectedUsers.length > 0 && (
          <>
            <motion.div
              key={"selectedUsers"}
              className="grid-flow-row grid gap-6 grid-cols-3 w-full flex-wrap"
            >
              {selectedUsers.map((user) => (
                <motion.div
                  className="flex flex-col"
                  key={user.username}
                  onClick={() => {
                    deselectUser(user);
                  }}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {makeUserBubble(user)}
                </motion.div>
              ))}
              <motion.div
                key={"resetUsers"}
                className="w-full flex flex-col justify-center overflow-hidden col-start-3"
                onClick={() => resetSelectedUsers()}
                exit={{ height: 0 }}
              >
                <FontAwesomeIcon
                  className="text-white text-lg"
                  icon={faRotateRight}
                />
                <p className="text-base text-center text-white">reset</p>
              </motion.div>
            </motion.div>
            <motion.div
              key="selectedSeparator"
              initial={{ height: 0, marginBottom: 0 }}
              animate={{ height: 2, marginBottom: 8 }}
              exit={{ height: 0, marginBottom: 0 }}
              className="w-full bg-linear-gradient"
            />
          </>
        )}
        {selectedUsers.length < 2 && (
          <motion.div
            key={"unselectedUsers"}
            className="grid-flow-row grid gap-6 grid-cols-3 w-full flex-wrap"
            exit={{ display: "none" }}
          >
            {unSelectedUsers.map((user) => (
              <motion.div
                className="flex flex-col"
                key={user.username}
                onClick={() => selectUser(user)}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {makeUserBubble(user)}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {/* <p className="text-lg lg:text-lg font-bold bg-linear-gradient bg-clip-text text-transparent w-fit">
        users by compatibility
      </p>
      {isFirstTime && (
        <span className="text-white text-sm lg:text-base font-normal">
          (this is the compatibility of each person with each other person)
        </span>
      )}
      <ul className="lg:ml-4 overflow-auto lg:max-h-36 mb-4 lg-mb-0 w-fit">
        {userPopularityRanking}
      </ul> */}
    </motion.div>
  );
};
