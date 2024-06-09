import { motion } from "framer-motion";

interface CircleShowcaseComponentProps {
  circleInfo: any;
}
export const CircleShowcaseComponent: React.FC<
  CircleShowcaseComponentProps
> = ({ circleInfo }) => {
  return (
    <motion.div className="h-full w-full px-6 py-2">
      <h1 className="font-fancy text-xl lg:text-lg-2xl text-transparent bg-linear-gradient bg-clip-text w-fit">
        {circleInfo.circleName}
      </h1>
    </motion.div>
  );
};
