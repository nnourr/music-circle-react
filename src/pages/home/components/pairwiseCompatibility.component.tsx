import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faRotateRight, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { random } from "lodash";
import CountUp from "react-countup";
import {
  CompatibilityDetail,
  CompatibilityResult,
} from "../helpers/getCircleCompatibility";
import { UserInterface } from "../models/user.model";
import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "../../../providers/isMobile.provider";

interface PairwiseCompatibilityProps {
  circleCompatibilityData: CompatibilityResult | undefined;
  users: UserInterface[];
  item: string;
  className?: string;
}

export const PairwiseCompatibility: React.FC<PairwiseCompatibilityProps> = ({
  circleCompatibilityData,
  users,
  item,
  className,
}) => {
  const [unSelectedUsers, setUnSelectedUsers] =
    useState<UserInterface[]>(users);
  const [selectedUsers, setSelectedUsers] = useState<UserInterface[]>([]);
  const [selectedCompatibility, setSelectedCompatibility] = useState<
    CompatibilityDetail | undefined
  >(undefined);
  const isMobile = useIsMobile();
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
    if (compatibilityResults.current !== null && isMobile) {
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

  const noCompatibilityTexts: string[] = [
    "are you even friends?",
    "seriously? nothing?",
    "not one in common?",
    "it's not negative!",
    "do better.",
    "I feel bad for you.",
  ];

  const makeUserBubble = (user: UserInterface) => (
    <div className="w-full rounded-full cursor-pointer">
      <div className="px-2 pb-1 relative">
        {user.images.length > 0 ? (
          <img
            src={user.images[user.images.length - 1]}
            className="w-full rounded-full aspect-square object-cover"
          />
        ) : (
          <div className="bg-radial-gradient w-full rounded-full flex justify-center items-center aspect-square">
            <FontAwesomeIcon
              icon={faCircleUser}
              className="text-1xl opacity-75"
            />
          </div>
        )}
      </div>
      <p className="text-sm text-center font-normal text-white overflow-hidden overflow-ellipsis leading-none">
        {user.username}
      </p>
    </div>
  );
  return (
    <div className={className}>
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
              className="grid-flow-row grid gap-y-3 gap-x-4 grid-cols-3 w-full flex-wrap"
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
                className="w-full flex flex-col justify-center overflow-hidden col-start-3 cursor-pointer opacity-80 hover:opacity-100 transition-opacity font-normal"
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
            className="grid-flow-row grid gap-y-3 gap-x-4 grid-cols-3 w-full flex-wrap"
            exit={{ display: "none" }}
          >
            {unSelectedUsers.map((user, i) => (
              <motion.div
                className="flex flex-col"
                key={user.username}
                onClick={() => selectUser(user)}
                layout
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isMobile ? 1 : 0.8,
                }}
                whileHover={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  animate={
                    isMobile && {
                      translateY: [0, -5, 0],
                      transition: {
                        repeat: Infinity,
                        repeatType: "mirror",
                        repeatDelay: 1.5,
                        delay: 0.1 * i,
                        ease: "easeInOut",
                      },
                    }
                  }
                >
                  {makeUserBubble(user)}
                </motion.div>
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
                    : 2.2,
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
    </div>
  );
};
