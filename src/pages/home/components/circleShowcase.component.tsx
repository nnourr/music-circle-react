import { motion } from "framer-motion";
import { CircleInfo } from "../models/circleInfo.model";
import { consolidateTopArtistsWithPoints } from "../helpers/consolidateTopArtistsWithPoints.helper";
import { StackedBar } from "./stackedBar.component";
import { useEffect, useState } from "react";

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

  if (!!!circleInfo) {
    return <></>;
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
      <div className="mt-3 lg:right-0 lg:mr-[7%] lg:max-w-[30%] xl:max-w-[40%] xl:mr-[10%] flex flex-col lg:fixed">
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
