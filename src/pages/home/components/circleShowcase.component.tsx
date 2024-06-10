import { motion } from "framer-motion";
import { CircleInfo } from "../models/circleInfo.model";
import { consolidateTopArtistsWithPoints } from "../helpers/consolidateTopArtistsWithPoints.helper";
import { StackedBar } from "./stackedBar.component";

interface CircleShowcaseComponentProps {
  circleInfo: CircleInfo | undefined;
}
export const CircleShowcaseComponent: React.FC<
  CircleShowcaseComponentProps
> = ({ circleInfo }) => {
  if (!!!circleInfo) {
    return <></>;
  }
  return (
    <motion.div className="h-full w-full px-6 py-2">
      <h1 className="font-fancy text-xl lg:text-lg-2xl lg:right-0 lg:mr-[15%] fixed text-transparent bg-linear-gradient bg-clip-text w-fit">
        {circleInfo.circleName}
      </h1>
      {/* <pre className="text-white">
        {JSON.stringify(consolidateTopArtistsWithPoints(circleInfo), null, " ")}
      </pre> */}
      <StackedBar
        artistsData={consolidateTopArtistsWithPoints(circleInfo)}
        className="h-full w-[35%] lg:ml-[15%] mt-8"
      ></StackedBar>
    </motion.div>
  );
};
