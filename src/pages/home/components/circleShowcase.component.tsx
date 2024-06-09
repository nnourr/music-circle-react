import { motion } from "framer-motion";
import { CircleInfo } from "../models/circleInfo.model";

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
    <motion.div className="h-full w-full px-6 py-2 overflow-scroll">
      <h1 className="font-fancy text-xl lg:text-lg-2xl text-transparent bg-linear-gradient bg-clip-text w-fit">
        {circleInfo.circleName}
      </h1>
      <pre className="text-white">
        {JSON.stringify(circleInfo.users, null, " ")}
      </pre>
    </motion.div>
  );
};
