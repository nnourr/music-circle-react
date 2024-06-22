import { motion } from "framer-motion";
import { CircleInfo } from "../models/circleInfo.model";
import { StackedBar } from "../components/stackedBar.component";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "../../../providers/user.provider";
import MultiSelector from "../components/multiSelector.component";
import { cloneDeep } from "lodash";
import Button, {
  btnSizes,
} from "../../../components/inputs/button.input.component";
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
import { consolidateCircle } from "../helpers/consolidateCircleInfo";

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

  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    circleInfo.users.map((user) => user.username)
  );
  const { username } = useUser();
  const isMobile = useIsMobile();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [showArtists, setShowArtists] = useState<boolean>(false);
  const [showPopularity, setShowPopularity] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const circleInfoClone = cloneDeep(circleInfo);
    circleInfoClone.users = circleInfoClone.users.filter((user) =>
      selectedUsers.includes(user.username)
    );
    setConsolidatedCircleData(consolidateCircle(circleInfoClone));
    setCirclePopularityData(getCirclePopularityData(circleInfoClone));
  }, [circleInfo, selectedUsers]);

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

  const isFirstTime = localStorage.getItem("firstTime") === "true";

  const onShareCircle = async () => {
    try {
      await navigator.share({
        url: `${window.location.origin}?circleCode=${circleInfo.circleCode}`,
      });
    } catch {
      onCopyCodeClick();
    }

    setCopyCircleCodeText("Circle Shared!");
    setTimeout(() => {
      setCopyCircleCodeText(`#${circleInfo.circleCode}`);
    }, 1000);
  };

  const handleShowArtists = () => {
    setShowArtists(true);
    setShowPopularity(false);
  };

  const handleShowPopularity = () => {
    setShowPopularity(true);
    setShowArtists(false);
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 10, behavior: "smooth" });
      localStorage.setItem("firstTime", "false");
    }
  };

  return (
    <motion.div className="mt-1 h-full box-border w-full px-6 py-2 overflow-auto">
      <div className="mt-3 lg:right-0 lg:mr-[5%] lg:max-w-[40%] xl:max-w-[30%] xl:mr-[10%] flex flex-col lg:text-left lg:fixed items-start pointer-events-none box-border lg:h-svh lg:pt-20 lg:pb-10 lg:mt-0 top-0">
        <ReactFitty
          maxSize={isMobile ? 80 : 140}
          minSize={isMobile ? 50 : 100}
          wrapText={true}
          className="font-fancy text-transparent bg-linear-gradient bg-clip-text leading-none overflow-hidden text-ellipsis w-full"
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
        </ReactFitty>
        <div>
          <motion.span
            className="text-sm font-sans text-white/80 hover:text-white transition-all cursor-pointer w-fit text-nowrap pointer-events-auto lg:ml-4"
            onClick={onCopyCodeClick}
            title="Copy Circle Code"
            whileTap={{ scale: 0.9 }}
          >
            {copyCircleCodeText}
          </motion.span>
          <motion.span
            className="text-sm font-sans text-white/80 hover:text-white  transition-all cursor-pointer pointer-events-auto ml-2 lg:ml-4"
            onClick={onShareCircle}
            title="Share Circle"
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon icon={faShare} />
          </motion.span>
        </div>

        {isMobile ? (
          <Button
            title="Show User Filters"
            btnSize={btnSizes.md}
            white={true}
            onClick={() => {}}
            className="mt-4 pointer-events-auto"
          >
            <span onClick={() => setShowFilter(!showFilter)}>
              filter by user
            </span>
            <motion.div
              animate={{
                height: showFilter ? "fit-content" : "0px",
                opacity: showFilter ? 1 : 0,
                pointerEvents: showFilter ? "auto" : "none",
              }}
            >
              <MultiSelector
                itemsData={circleUsernames}
                onSelectionChange={onSelectionChange}
                className="px-4"
                onClick={() => {
                  setShowFilter(true);
                }}
              />
            </motion.div>
          </Button>
        ) : (
          <>
            <MultiSelector
              itemsData={circleUsernames}
              onSelectionChange={onSelectionChange}
              className="pointer-events-auto ml-4 my-4"
            />
            <CirclePopularity circlePopularityData={circlePopularityData} />
          </>
        )}
      </div>
      <motion.div
        animate={
          isFirstTime
            ? { gap: ["0px", "8px", "0px"], transition: { repeat: Infinity } }
            : {}
        }
        ref={scrollContainerRef}
        className="overflow-x-auto flex flex-row gap-4 w-full snap-x snap-mandatory pr-[30vw] lg:pr-0"
      >
        <motion.h2
          initial={{ opacity: 0.3 }}
          whileInView={{ opacity: 0.8 }}
          viewport={{ margin: "400px -150px 400px -150px" }}
          onViewportEnter={() => {
            handleShowArtists();
          }}
          className="bg-linear-gradient font-bold snap-start text-nowrap bg-clip-text text-transparent lg:ml-[3%] xl:ml-[13%] text-1xl lg:text-lg-xl w-fit"
        >
          top ten artists:
        </motion.h2>
        <motion.h2
          initial={{ opacity: isMobile ? 0.3 : 0 }}
          whileInView={{ opacity: isMobile ? 0.8 : 0 }}
          viewport={{ margin: "400px -150px 400px -150px" }}
          onViewportEnter={() => {
            handleShowPopularity();
          }}
          onClick={handleScroll}
          className="bg-linear-gradient font-bold snap-start text-nowrap bg-clip-text pl-6 text-transparent lg:ml-[3%] xl:ml-[13%] text-1xl lg:text-lg-xl w-fit"
        >
          circle popularity:
        </motion.h2>
      </motion.div>

      {showArtists || !isMobile ? (
        <StackedBar
          itemsData={consolidatedCircleData.artists}
          className="h-full w-full mt-4 lg:max-w-[50%] xl:max-w-[40%] lg:ml-[5%] xl:ml-[15%]"
        ></StackedBar>
      ) : (
        ""
      )}
      {showPopularity && isMobile ? (
        <CirclePopularity
          className="w-fit mt-6 mx-6 mb-24"
          circlePopularityData={circlePopularityData}
        />
      ) : (
        ""
      )}
    </motion.div>
  );
};
