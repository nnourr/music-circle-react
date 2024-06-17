import { motion } from "framer-motion";
import { CircleInfo } from "../models/circleInfo.model";
import {
  ConsolidatedArtist,
  consolidateTopArtistsWithPoints,
} from "../helpers/consolidateTopArtistsWithPoints.helper";
import { StackedBar } from "./stackedBar.component";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useUser } from "../../../providers/user.provider";
import MultiSelector from "./multiSelector.component";
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
import { CirclePopularity } from "./circlePopularity.component";

interface CircleShowcaseComponentProps {
  circleInfo: CircleInfo;
  isLoading: boolean;
}
export const CircleShowcaseComponent: React.FC<
  CircleShowcaseComponentProps
> = ({ circleInfo, isLoading }) => {
  const [copyCircleCodeText, setCopyCircleCodeText] = useState<string>();
  useEffect(() => {
    setCopyCircleCodeText(`#${circleInfo.circleCode}`);
  }, [circleInfo.circleCode]);

  const [consolidatedArtistData, setConsolidatedArtistData] = useState<
    ConsolidatedArtist[]
  >(consolidateTopArtistsWithPoints(circleInfo));
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

  useEffect(() => {
    const circleInfoClone = cloneDeep(circleInfo);
    circleInfoClone.users = circleInfoClone.users.filter((user) =>
      selectedUsers.includes(user.username)
    );
    setConsolidatedArtistData(consolidateTopArtistsWithPoints(circleInfoClone));
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
    Object.values(consolidatedArtistData).some((value) => {
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
    navigator.clipboard.writeText(
      `${window.location.origin}?circleCode=${circleInfo.circleCode}`
    );
    setCopyCircleCodeText("Code Copied!");
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

  return (
    <motion.div className="mt-1 h-full box-border w-full px-6 py-2 overflow-auto">
      <div className="mt-3 lg:mt-8 lg:right-0 lg:mr-[5%] lg:max-w-[40%] xl:max-w-[30%] xl:mr-[10%] flex flex-col lg:text-left lg:fixed items-start pointer-events-none">
        <ReactFitty
          maxSize={isMobile ? 80 : 200}
          minSize={isMobile ? 50 : 100}
          wrapText={true}
          className="font-fancy text-xl lg:text-lg-2xl text-transparent bg-linear-gradient bg-clip-text leading-[1] w-full"
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
        <motion.span
          className="text-sm font-sans text-white/80 hover:text-white transition-all cursor-pointer w-fit text-nowrap pointer-events-auto lg:ml-4"
          onClick={onCopyCodeClick}
          title="Copy Circle Code"
          whileTap={{ scale: 0.9 }}
        >
          {copyCircleCodeText}
        </motion.span>

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
          ""
        )}

        {!isMobile ? (
          <div className="flex flex-col lg:mt-4 h-full xl:mt-8 lg:gap-4 xl:gap-8">
            <MultiSelector
              itemsData={circleUsernames}
              onSelectionChange={onSelectionChange}
              className="flex-shrink-0 pointer-events-auto ml-4"
            />
            <CirclePopularity circlePopularityData={circlePopularityData} />
          </div>
        ) : (
          // <Button
          //   title="Show Circle Popularity"
          //   btnSize={btnSizes.md}
          //   white={true}
          //   onClick={() => {}}
          // >
          //   <span onClick={() => setShowFilter(!showFilter)}>
          //     Show Popularity
          //   </span>
          //   <motion.div
          //     animate={{
          //       height: showFilter ? "fit-content" : "0px",
          //       opacity: showFilter ? 1 : 0,
          //       pointerEvents: showFilter ? "auto" : "none",
          //     }}
          //   >
          //     <CirclePopularity circlePopularityData={circlePopularityData} />
          //   </motion.div>
          // </Button>
          ""
        )}
      </div>
      <div className="overflow-x-auto flex flex-row gap-4 w-full snap-x snap-mandatory pr-[30vw] lg:pr-0">
        <motion.h2
          initial={{ opacity: 0.3 }}
          whileInView={{ opacity: 0.8 }}
          viewport={{ margin: "400px -200px 400px -200px" }}
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
          viewport={{ margin: "400px -200px 400px -200px" }}
          onViewportEnter={() => {
            handleShowPopularity();
          }}
          className="bg-linear-gradient font-bold snap-start text-nowrap bg-clip-text text-transparent lg:ml-[3%] xl:ml-[13%] text-1xl lg:text-lg-xl w-fit"
        >
          circle popularity:
        </motion.h2>
      </div>

      {showArtists || !isMobile ? (
        <StackedBar
          artistsData={consolidatedArtistData}
          className="h-full w-full mt-4 lg:max-w-[50%] xl:max-w-[40%] lg:ml-[5%] xl:ml-[15%]"
        ></StackedBar>
      ) : (
        ""
      )}
      {showPopularity && isMobile ? (
        <CirclePopularity
          className="w-full"
          circlePopularityData={circlePopularityData}
        />
      ) : (
        ""
      )}
      {/* <div className="overflow-x-auto fit-content">
        <div className="inline-block h-[100vh]">
          <StackedBar
            artistsData={consolidatedArtistData}
            className="w-full h-full lg:max-w-[50%] xl:max-w-[40%] lg:ml-[5%] xl:ml-[15%] mt-4"
          ></StackedBar>
        </div>
        <CirclePopularity
          className="w-full h-full relative -right-full top-0"
          circlePopularityData={circlePopularityData}
        />
      </div> */}
    </motion.div>
  );
};
