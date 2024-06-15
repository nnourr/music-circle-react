import { motion } from "framer-motion";
import { CircleInfo } from "../models/circleInfo.model";
import {
  ConsolidatedArtist,
  consolidateTopArtistsWithPoints,
} from "../helpers/consolidateTopArtistsWithPoints.helper";
import { StackedBar } from "./stackedBar.component";
import { useEffect, useState } from "react";
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
  const [showFilter, setShowFilter] = useState<boolean>(!isMobile);

  useEffect(() => {
    const circleInfoClone = cloneDeep(circleInfo);
    circleInfoClone.users = circleInfoClone.users.filter((user) =>
      selectedUsers.includes(user.username)
    );
    setConsolidatedArtistData(consolidateTopArtistsWithPoints(circleInfoClone));
  }, [circleInfo, selectedUsers]);

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
    <motion.div className="mt-1 h-full box-border w-full px-6 py-2 overflow-auto">
      <div className="mt-3 lg:mt-8 lg:right-0 lg:mr-[10%] lg:max-w-[40%] xl:max-w-[40%] xl:mr-[10%] flex flex-col lg:fixed">
        <h1 className="font-fancy text-xl lg:text-lg-2xl text-transparent bg-linear-gradient bg-clip-text w-min leading-[1]">
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
        {isMobile ? (
          <Button
            btnSize={btnSizes.md}
            onClick={() => setShowFilter(!showFilter)}
            className="mt-6"
            white={true}
          >
            Filter by User
          </Button>
        ) : (
          ""
        )}
        <motion.div
          animate={{
            height: showFilter ? "fit-content" : "0px",
            opacity: showFilter ? 1 : 0,
            pointerEvents: showFilter ? "all" : "none",
          }}
        >
          <MultiSelector
            itemsData={circleInfo.users.map((user) => user.username)}
            onSelectionChange={(selectedUsernames) =>
              setSelectedUsers(selectedUsernames)
            }
          />
        </motion.div>
      </div>
      {/* <pre className="text-white">
        {JSON.stringify(consolidateTopArtistsWithPoints(circleInfo), null, " ")}
      </pre> */}
      <h2 className="bg-linear-gradient font-bold opacity-80 bg-clip-text text-transparent lg:ml-[7%] xl:ml-[15%] mt-2 text-lg lg:text-lg-xl w-fit">
        Top 10 Artists:
      </h2>

      <StackedBar
        artistsData={consolidatedArtistData}
        className="h-full w-full lg:max-w-[55%] lg:ml-[7%] xl:ml-[15%] mt-4"
      ></StackedBar>
    </motion.div>
  );
};
