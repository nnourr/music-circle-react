import { motion } from "framer-motion";
import { CircleInfo } from "../models/circleInfo.model";
import { consolidateTopArtistsWithPoints } from "../helpers/consolidateTopArtistsWithPoints.helper";
import { StackedBar } from "./stackedBar.component";
import { useState } from "react";

interface CircleShowcaseComponentProps {
  circleInfo: CircleInfo | undefined;
}
export const CircleShowcaseComponent: React.FC<
  CircleShowcaseComponentProps
> = ({ circleInfo }) => {
  const [copyCircleCodeText, setCopyCircleCodeText] = useState<string>(
    `#${circleInfo?.circleCode}`
  );
  if (!!!circleInfo) {
    return <></>;
  }
  const onCopyCodeClick = () => {
    navigator.clipboard.writeText(circleInfo.circleCode);
    setCopyCircleCodeText("Code Copied!");
    setTimeout(() => {
      setCopyCircleCodeText(`#${circleInfo?.circleCode}`);
    }, 1000);
  };
  return (
    <motion.div className="mt-1 h-full box-border w-full px-6 py-2 overflow-auto">
      <div className="mt-3 lg:right-0 lg:mr-[7%] max-w-[30%] xl:mr-[7%] flex flex-col lg:fixed">
        <h1 className="font-fancy text-xl lg:text-lg-2xl text-transparent bg-linear-gradient bg-clip-text w-fit leading-[1]">
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
      </div>
      {/* <pre className="text-white">
        {JSON.stringify(consolidateTopArtistsWithPoints(circleInfo), null, " ")}
      </pre> */}
      <StackedBar
        artistsData={consolidateTopArtistsWithPoints(circleInfo)}
        className="h-full w-full lg:w-[35%] lg:ml-[7%] xl:ml-[15%] mt-8"
      ></StackedBar>
    </motion.div>
  );
};
