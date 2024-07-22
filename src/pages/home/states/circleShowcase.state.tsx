import { motion } from "framer-motion";
import { CircleInfo } from "../models/circleInfo.model";
import { StackedBar } from "../components/stackedBar.component";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "../../../providers/user.provider";
import MultiSelector from "../components/multiSelector.component";
import { cloneDeep } from "lodash";
import { useIsMobile } from "../../../providers/isMobile.provider";
import { ReactFitty } from "react-fitty";
import {
  CirclePopularityData,
  getCirclePopularityData,
} from "../helpers/getCirclePopularity";
import { CirclePopularity } from "../components/circlePopularity.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { ConsolidatedCircle } from "../models/consolidatedItems.model";
import {
  AllowedItems,
  consolidateCircle,
} from "../helpers/consolidateCircleInfo";
import { Selector } from "../../../components/inputs/selector.input.component";
import { Footer } from "../../../components/footer.component";
import Button, {
  btnSizes,
} from "../../../components/inputs/button.input.component";
import { BoxContainer } from "../../../components/boxContainer.component";
import { BackgroundGradient } from "../../landing/components/background-gradient.component";
import {
  CircleCompatibilityData,
  getCircleCompatibility,
} from "../helpers/getCircleCompatibility";
import { CircleCompatibility } from "../components/circleCompatibility.component";

interface CircleShowcaseStateProps {
  circleInfo: CircleInfo;
  isLoading: boolean;
}
export const CircleShowcaseState: React.FC<CircleShowcaseStateProps> = ({
  circleInfo,
  isLoading,
}) => {
  const [copyCircleCodeText, setCopyCircleCodeText] = useState<string>();
  useEffect(() => {
    setCopyCircleCodeText(`#${circleInfo.circleCode}`);
  }, [circleInfo.circleCode]);

  const [consolidatedCircleData, setConsolidatedCircleData] =
    useState<ConsolidatedCircle>(consolidateCircle(circleInfo));
  const [circlePopularityData, setCirclePopularityData] =
    useState<CirclePopularityData>(getCirclePopularityData(circleInfo));
  const [circleCompatibilityData, setCircleCompatibilityData] =
    useState<CircleCompatibilityData>(getCircleCompatibility(circleInfo.users));
  const [selectedItem, setSelectedItem] = useState<AllowedItems>("artists");
  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    circleInfo.users.map((user) => user.username)
  );
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);
  const { username } = useUser();
  const isMobile = useIsMobile();
  const [showArtists, setShowArtists] = useState<boolean>(false);
  const [showPopularity, setShowPopularity] = useState<boolean>(false);
  const [showCompatibility, setShowCompatibility] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const circleInfoClone = cloneDeep(circleInfo);
    circleInfoClone.users = circleInfoClone.users.filter((user) =>
      selectedUsers.includes(user.username)
    );
    setConsolidatedCircleData(consolidateCircle(circleInfoClone));
    setCirclePopularityData(getCirclePopularityData(circleInfoClone));
    setCircleCompatibilityData(getCircleCompatibility(circleInfoClone.users));
  }, [circleInfo, selectedUsers]);

  useEffect(() => {
    setIsFirstTime(localStorage.getItem("firstTime") === "true");
  }, []);

  const onSelectionChange = useCallback((selectedUsernames: string[]) => {
    setSelectedUsers(selectedUsernames);
  }, []);

  const circleUsernames = useMemo(
    () => circleInfo.users.map((user) => user.username),
    [circleInfo]
  );

  if (
    Object.values(consolidatedCircleData.artists).some((value) => {
      return (
        value.contributors.includes(username || "") &&
        Object.values(value).some((value) => value === undefined)
      );
    }) ||
    Object.values(consolidatedCircleData.tracks).some((value) => {
      return (
        value.contributors.includes(username || "") &&
        Object.values(value).some((value) => value === undefined)
      );
    })
  ) {
    localStorage.removeItem("user");
    window.location.reload();
  }

  const onCopyCodeClick = () => {
    navigator.clipboard.writeText(circleInfo.circleCode);

    setCopyCircleCodeText("Code Copied!");
    setTimeout(() => {
      setCopyCircleCodeText(`#${circleInfo.circleCode}`);
    }, 1000);
  };

  const onShareCircle = async () => {
    try {
      await navigator.share({
        url: `${window.location.origin}?circleCode=${circleInfo.circleCode}`,
      });

      setCopyCircleCodeText("Circle Shared!");
      setTimeout(() => {
        setCopyCircleCodeText(`#${circleInfo.circleCode}`);
      }, 1000);
    } catch {
      onCopyCodeClick();
    }
  };

  const handleShowArtists = () => {
    setShowArtists(true);
    setShowPopularity(false);
    setShowCompatibility(false);
  };

  const handleShowPopularity = () => {
    setIsFirstTime(false);
    localStorage.setItem("firstTime", "false");
    setShowPopularity(true);
    setShowArtists(false);
    setShowCompatibility(false);
  };

  const handleShowCompatibility = () => {
    setIsFirstTime(false);
    localStorage.setItem("firstTime", "false");
    setShowPopularity(false);
    setShowArtists(false);
    setShowCompatibility(true);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 10, behavior: "smooth" });
      setIsFirstTime(false);
      localStorage.setItem("firstTime", "false");
    }
  };

  const Title = useCallback(() => {
    return (
      <BoxContainer key="title" className="w-full lg:w-auto">
        <ReactFitty
          maxSize={isMobile ? 80 : 140}
          minSize={isMobile ? 50 : 100}
          wrapText={true}
          className="font-fancy text-transparent bg-linear-gradient bg-clip-text leading-none overflow-hidden text-ellipsis"
        >
          {isLoading ? (
            <>
              <motion.span
                animate={{
                  translateY: ["0px", "-10px", "0"],
                  transition: { repeat: Infinity },
                }}
                className="inline-block text-white"
              >
                .
              </motion.span>
              <motion.span
                animate={{
                  translateY: ["0px", "-10px", "0"],
                  transition: { repeat: Infinity, delay: 0.1 },
                }}
                className="inline-block text-white"
              >
                .
              </motion.span>
              <motion.span
                animate={{
                  translateY: ["0px", "-10px", "0"],
                  transition: { repeat: Infinity, delay: 0.2 },
                }}
                className="inline-block text-white"
              >
                .
              </motion.span>
            </>
          ) : (
            circleInfo.circleName
          )}
        </ReactFitty>{" "}
        <motion.span
          className="text-sm font-sans text-white/80 hover:text-white transition-all cursor-pointer w-fit text-nowrap"
          onClick={onCopyCodeClick}
          title="Copy Circle Code"
          whileTap={{ scale: 0.9 }}
        >
          {copyCircleCodeText}
        </motion.span>
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="inline-block lg:static fixed bottom-8 right-4 z-50"
        >
          <Button
            onClick={onShareCircle}
            title="Share Circle"
            white={true}
            btnSize={btnSizes.sm}
            className="px-4 ml-8 flex bg-black"
          >
            share
            <FontAwesomeIcon className="ml-2 mt-0.5" icon={faShare} />
          </Button>
        </motion.div>
      </BoxContainer>
    );
  }, [copyCircleCodeText, circleInfo.circleName, isLoading, isMobile]);

  return (
    <motion.div className="h-full box-border w-full relative overflow-y-auto overflow-x-hidden flex items-center flex-col">
      <BackgroundGradient className="!fixed opacity-15" />
      <BoxContainer
        forceVisible={isMobile}
        className="w-full px-[7%] py-4 lg:p-0 lg:w-fit !pb-14"
      >
        {isMobile && (
          <>
            <div className="mt-2 w-full">
              <Title />
            </div>
            <div className="flex flex-nowrap w-full justify-between gap-4">
              <MultiSelector
                itemsData={circleUsernames}
                onSelectionChange={onSelectionChange}
                isCollapsible={true}
                collapsibleTitle="members"
                className="mt-4 pointer-events-auto text-nowrap w-full basis-1/2 h-fit"
              />
              <Selector
                className="mt-4 pointer-events-auto text-nowrap w-full basis-1/2 h-fit"
                onChange={(value) => setSelectedItem(value as AllowedItems)}
                options={[
                  { label: "artists", value: "artists" },
                  { label: "tracks", value: "tracks" },
                ]}
              />
            </div>
          </>
        )}
        <div className="w-full mt-4 lg:flex lg:justify-center lg:max-w-[90vw]">
          <BoxContainer
            key="stackedBar"
            className="min-h-full w-full lg:w-[48rem] lg:pt-2 lg:mr-4"
          >
            {!isMobile ? (
              <div className="flex flex-nowrap items-baseline gap-4">
                <motion.h2 className="bg-linear-gradient inline-block font-bold text-nowrap mb-2 bg-clip-text text-transparent text-1xl lg:text-lg-xl w-fit opacity-80">
                  top ten
                </motion.h2>
                <Selector
                  onChange={(value) => setSelectedItem(value as AllowedItems)}
                  options={[
                    { label: "artists", value: "artists" },
                    { label: "tracks", value: "tracks" },
                  ]}
                  className="flex-shrink-0 h-fit"
                />
              </div>
            ) : (
              <motion.div
                animate={
                  isFirstTime
                    ? {
                        gap: ["0px", "8px", "0px"],
                        transition: { repeat: Infinity },
                      }
                    : { marginBottom: showArtists ? "2rem" : "0" }
                }
                ref={scrollContainerRef}
                className="overflow-x-auto pr-56 overflow-y-visible gap-1 flex flex-row w-[95vw] snap-x snap-mandatory -mx-6"
              >
                <motion.h2
                  viewport={{ margin: "400px -50% 400px -50%" }}
                  onViewportEnter={() => {
                    handleShowArtists();
                  }}
                  initial={{ opacity: 0.3 }}
                  whileInView={{ opacity: 0.8 }}
                  className="snap-start bg-linear-gradient font-bold text-nowrap bg-clip-text text-transparent text-1xl w-fit pl-6"
                >
                  top ten {selectedItem}
                </motion.h2>
                <motion.h2
                  viewport={{ margin: "400px -50% 400px -50%" }}
                  onViewportEnter={() => {
                    handleShowPopularity();
                  }}
                  initial={{ opacity: 0.3 }}
                  whileInView={{ opacity: 0.8 }}
                  onClick={handleScroll}
                  className="bg-linear-gradient font-bold snap-start text-nowrap bg-clip-text text-transparent text-1xl w-fit scroll-m-[10vw]"
                >
                  circle popularity
                </motion.h2>
                <motion.h2
                  viewport={{ margin: "400px -50% 400px -50%" }}
                  onViewportEnter={() => {
                    handleShowCompatibility();
                  }}
                  initial={{ opacity: 0.3 }}
                  whileInView={{ opacity: 0.8 }}
                  onClick={handleScroll}
                  className="bg-linear-gradient font-bold snap-start text-nowrap bg-clip-text text-transparent text-1xl w-fit scroll-m-[7vw]"
                >
                  circle compatibility
                </motion.h2>
              </motion.div>
            )}
            {(showArtists || !isMobile) && (
              <StackedBar
                itemsData={consolidatedCircleData[selectedItem]}
                className="h-auto min-h-full w-full"
              ></StackedBar>
            )}
            {showPopularity && (
              <CirclePopularity
                className="w-fit mb-[50vh] ml-[5vw]"
                itemPopularityData={circlePopularityData[selectedItem]}
              />
            )}
            {showCompatibility && (
              <CircleCompatibility
                className="w-fit mb-[50vh] ml-[2vw]"
                circleCompatibilityData={circleCompatibilityData[selectedItem]}
              />
            )}
          </BoxContainer>
          {!isMobile && (
            <div className="flex flex-col gap-4">
              {Title()}
              <div className="flex gap-2">
                <div className="flex flex-col gap-2 flex-grow">
                  <BoxContainer
                    key="circlePopularity"
                    className="h-fit  row-start-1 -row-end-1"
                  >
                    <CirclePopularity
                      itemPopularityData={circlePopularityData[selectedItem]}
                      className="w-fit flex-grow-0 pointer-events-none"
                    />{" "}
                  </BoxContainer>
                  <BoxContainer
                    key="circleCompatibility"
                    className="h-fit row-start-1 -row-end-1"
                  >
                    <CircleCompatibility
                      circleCompatibilityData={
                        circleCompatibilityData[selectedItem]
                      }
                      className="w-fit flex-grow-0 pointer-events-none"
                    />{" "}
                  </BoxContainer>
                </div>
                <div className="flex flex-col gap-2 flex-grow">
                  <BoxContainer
                    key="members"
                    className="h-fit row-start-1 -row-end-1"
                  >
                    <h2 className="font-bold block w-min mb-3 opacity-80 text-nowrap text-lg-lg bg-linear-gradient bg-clip-text text-transparent leading-none">
                      members
                    </h2>
                    <MultiSelector
                      itemsData={circleUsernames}
                      onSelectionChange={onSelectionChange}
                    />
                  </BoxContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </BoxContainer>
      <Footer className="w-full" />
    </motion.div>
  );
};
