import { motion } from "framer-motion";
import { CircleInfo } from "../models/circleInfo.model";
import {
  ConsolidatedArtist,
  consolidateTopArtistsWithPoints,
} from "../helpers/consolidateTopArtistsWithPoints.helper";
import { StackedBar } from "./stackedBar.component";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "../../../providers/user.provider";
import MultiSelector from "./multiSelector.component";
import { cloneDeep } from "lodash";
import Button, {
  btnSizes,
} from "../../../components/inputs/button.input.component";
import { useIsMobile } from "../../../providers/isMobile.provider";

interface CircleShowcaseComponentProps {
  circleInfo: CircleInfo;
}
export const CircleShowcaseComponent: React.FC<
  CircleShowcaseComponentProps
> = ({ circleInfo }) => {
  const [copyCircleCodeText, setCopyCircleCodeText] = useState<string>();
  useEffect(() => {
    setCopyCircleCodeText(`#${circleInfo.circleCode}`);
  }, [circleInfo.circleCode]);

  const [consolidatedArtistData, setConsolidatedArtistData] = useState<
    ConsolidatedArtist[]
  >(consolidateTopArtistsWithPoints(circleInfo));

  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    circleInfo.users.map((user) => user.username)
  );

  const { username } = useUser();
  const isMobile = useIsMobile();
  const [showFilter, setShowFilter] = useState<boolean>(false);

  useEffect(() => {
    const circleInfoClone = cloneDeep(circleInfo);
    circleInfoClone.users = circleInfoClone.users.filter((user) =>
      selectedUsers.includes(user.username)
    );
    setConsolidatedArtistData(consolidateTopArtistsWithPoints(circleInfoClone));
  }, [circleInfo, selectedUsers]);

  const onSelectionChange = useCallback((selectedUsernames: string[]) => {
    setSelectedUsers(selectedUsernames);
  }, []);

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
    navigator.clipboard.writeText(circleInfo.circleCode);
    setCopyCircleCodeText("Code Copied!");
    setTimeout(() => {
      setCopyCircleCodeText(`#${circleInfo.circleCode}`);
    }, 1000);
  };
  return (
    <motion.div className="mt-1 flex flex-col h-full box-border w-full px-6 py-2 overflow-auto">
      <div className="mt-3 lg:mt-8 lg:right-0 lg:mr-[5%] lg:max-w-[30%] xl:max-w-[40%] xl:mr-[10%] flex flex-col lg:fixed items-end xl:items-start">
        <h1 className="font-fancy text-xl lg:text-lg-2xl lg:text-right text-transparent bg-linear-gradient bg-clip-text w-fit leading-[1]">
          {circleInfo.circleName}
        </h1>
        <motion.span
          className="text-sm font-sans text-white/80 hover:text-white transition-all cursor-pointer w-fit text-nowrap"
          onClick={onCopyCodeClick}
          title="Copy Circle Code"
          whileTap={{ scale: 0.9 }}
        >
          {copyCircleCodeText}
        </motion.span>
        {!isMobile ? (
          <MultiSelector
            itemsData={circleInfo.users.map((user) => user.username)}
            onSelectionChange={onSelectionChange}
          />
        ) : (
          ""
        )}
      </div>
      {/* <pre className="text-white">
        {JSON.stringify(consolidateTopArtistsWithPoints(circleInfo), null, " ")}
      </pre> */}
      <h2 className="bg-linear-gradient font-bold opacity-80 bg-clip-text text-transparent lg:ml-[5%] xl:ml-[15%] mt-2 text-1xl lg:text-lg-xl w-fit">
        top 10 artists:
      </h2>

      {isMobile ? (
        <Button btnSize={btnSizes.md} white={true} onClick={() => {}}>
          <span onClick={() => setShowFilter(!showFilter)}>filter by user</span>
          <motion.div
            animate={{
              height: showFilter ? "fit-content" : "0px",
              opacity: showFilter ? 1 : 0,
              pointerEvents: showFilter ? "all" : "none",
            }}
          >
            <MultiSelector
              itemsData={circleInfo.users.map((user) => user.username)}
              onSelectionChange={onSelectionChange}
              onClick={() => {
                console.log("hello");
                setShowFilter(true);
              }}
            />
          </motion.div>
        </Button>
      ) : (
        ""
      )}

      <StackedBar
        artistsData={consolidatedArtistData}
        className="h-full w-full lg:max-w-[50%] xl:max-w-[40%] lg:ml-[5%] xl:ml-[15%] mt-4"
      ></StackedBar>
    </motion.div>
  );
};
