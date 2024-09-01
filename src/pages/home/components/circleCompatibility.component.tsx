import { AnimatePresence, motion } from "framer-motion";
import {
  CompatibilityDetail,
  CompatibilityResult,
} from "../helpers/getCircleCompatibility";
import { useIsMobile } from "../../../providers/isMobile.provider";
import { UserInterface } from "../models/user.model";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import CountUp from "react-countup";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { random } from "lodash";

interface CircleCompatibilityProps {
  circleCompatibilityData: CompatibilityResult | undefined;
  users: UserInterface[];
  className?: string;
  item: string;
}

export const CircleCompatibility: React.FC<CircleCompatibilityProps> = ({
  circleCompatibilityData,
  className,
  users,
  item,
}) => {
  const isMobile = useIsMobile();
  const [unSelectedUsers, setUnSelectedUsers] =
    useState<UserInterface[]>(users);
  const [selectedUsers, setSelectedUsers] = useState<UserInterface[]>([]);
  const [selectedCompatibility, setSelectedCompatibility] = useState<
    CompatibilityDetail | undefined
  >(undefined);
  const compatibilityResults = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (selectedUsers.length < 2 || !!!circleCompatibilityData) {
      return;
    }

    const _selectedCompatibilityArray =
      circleCompatibilityData.compatibilityMatrix.filter(
        (detail) =>
          (detail.user1Name === selectedUsers[0].username ||
            detail.user1Name === selectedUsers[1].username) &&
          (detail.user2Name === selectedUsers[0].username ||
            detail.user2Name === selectedUsers[1].username)
      );

    if (_selectedCompatibilityArray.length !== 1) {
      console.error("problem getting compatibility data");
      resetSelectedUsers();
    }

    setSelectedCompatibility(_selectedCompatibilityArray[0]);
    if (compatibilityResults.current !== null) {
      compatibilityResults.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedUsers, item]);

  useEffect(() => {
    resetSelectedUsers();
  }, [circleCompatibilityData?.compatibilityMatrix.toString()]);

  useEffect(() => {
    if (users.length == 2) {
      setSelectedUsers(users);
      setUnSelectedUsers([]);
    }
  }, [users]);

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

  const noCompatibilityTexts: string[] = [
    "are you even friends?",
    "seriously? nothing?",
    "not one in common?",
    "it's not negative!",
    "do better.",
    "I feel bad for you.",
  ];

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
      <p className="text-sm text-center text-white overflow-hidden overflow-ellipsis">
        {user.username}
      </p>
    </div>
  );

  return (
    <motion.div
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
      <p
        className="text-lg lg:text-lg font-bold bg-linear-gradient bg-clip-text text-transparent w-fit"
        ref={compatibilityResults}
      >
        {selectedUsers.length === 2
          ? "view compatibility"
          : `select ${2 - selectedUsers.length} member${
              selectedUsers.length === 1 ? "" : "s"
            }`}
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
        {selectedUsers.length < 2 ? (
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
        ) : (
          <motion.div
            exit={{ display: "none" }}
            className="mt-2"
            key={"compatibilityResults"}
          >
            <div className="flex justify-evenly">
              <motion.div
                className="relative w-full aspect-square"
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <div className="rounded-full relative opacity-30 bg-radial-gradient w-full aspect-square" />
                <motion.div
                  className="rounded-full absolute top-0 left-0 bg-radial-gradient z-10 aspect-square w-full"
                  style={{ scale: 0 }}
                  animate={{
                    scale:
                      (selectedCompatibility?.sharedItems.length || -1) > 0
                        ? [
                            null,
                            `${
                              Math.sqrt(
                                (selectedCompatibility?.compatibilityPercentage ||
                                  0) / 100
                              ) * 100
                            }%`,
                            `${
                              Math.sqrt(
                                (selectedCompatibility?.compatibilityPercentage ||
                                  0) / 100
                              ) * 95
                            }%`,
                            `${
                              Math.sqrt(
                                (selectedCompatibility?.compatibilityPercentage ||
                                  0) / 100
                              ) * 100
                            }%`,
                            `${
                              Math.sqrt(
                                (selectedCompatibility?.compatibilityPercentage ||
                                  0) / 100
                              ) * 95
                            }%`,
                          ]
                        : ["0%", "20%", "0%"],
                    transition: {
                      duration: 4,
                      ease: "easeInOut",
                      repeat:
                        (selectedCompatibility?.sharedItems.length || -1) > 0
                          ? Infinity
                          : 0,
                      repeatType: "reverse",
                    },
                  }}
                ></motion.div>
              </motion.div>
              <motion.p
                animate={{ opacity: 1, translateY: 0 }}
                initial={{ opacity: 0, translateY: 20 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="w-full text-xl self-center text-center"
              >
                <span className="bg-linear-gradient bg-clip-text text-transparent">
                  {(selectedCompatibility?.sharedItems.length || -1) > 0 ? (
                    <>
                      <CountUp
                        end={Math.round(
                          selectedCompatibility?.compatibilityPercentage || 0
                        )}
                        duration={2.75}
                      />
                      <span className="text-white">%</span>
                    </>
                  ) : (
                    <>
                      <CountUp
                        end={21}
                        duration={2}
                        onEnd={({ update }) => update(0)}
                      />
                      <span className="text-white">%</span>
                    </>
                  )}
                </span>
              </motion.p>
            </div>
            <motion.div
              animate={{ opacity: 1 }}
              transition={{
                delay:
                  (selectedCompatibility?.sharedItems.length || -1) > 0
                    ? 1.3
                    : 2,
                duration: 0.5,
                ease: "easeInOut",
              }}
              initial={{ opacity: 0 }}
            >
              {(selectedCompatibility?.sharedItems.length || -1) > 0 ? (
                <>
                  <p className="text-lg mt-2 lg:text-lg font-bold bg-linear-gradient bg-clip-text text-transparent w-fit">
                    shared {item}
                  </p>
                  <div className="grid grid-cols-2 grid-flow-row gap-6">
                    {selectedCompatibility?.sharedItems.map((item) => (
                      <a
                        href={item.url}
                        target="_blank"
                        className="w-full"
                        key={item.name}
                      >
                        <img
                          src={item.images[0].url}
                          className="w-full aspect-square mb-2"
                        />
                        <p className="text-sm text-center w-full text-white">
                          {item.name}
                          <FontAwesomeIcon icon={faSpotify} className="ml-2" />
                        </p>
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-lg mt-2 lg:text-lg font-bold bg-linear-gradient bg-clip-text text-transparent w-fit">
                  {
                    noCompatibilityTexts[
                      random(0, noCompatibilityTexts.length - 1)
                    ]
                  }
                </p>
              )}
            </motion.div>
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
