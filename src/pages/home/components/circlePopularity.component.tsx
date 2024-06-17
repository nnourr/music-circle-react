import { motion } from "framer-motion";
import { CirclePopularityData } from "../helpers/getCirclePopularity";

interface CirclePopularityProps {
  circlePopularityData: CirclePopularityData;
  className?: string;
}

export const CirclePopularity: React.FC<CirclePopularityProps> = ({
  circlePopularityData,
  className,
}) => {
  const obscurityRanking = circlePopularityData.obscurityRanking.map(
    (user, i) => (
      <li className="text-base lg:text-base text-white" key={user.username}>
        {i + 1}. {user.username}:{" "}
        <span className="bg-linear-gradient bg-clip-text text-transparent">
          {user.averagePopularity}
        </span>
        /100
      </li>
    )
  );

  return (
    <motion.div
      key="circlePopularityData"
      className={`${className} font-bold text-left`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: circlePopularityData.averagePopularity === 0 ? 0 : 0.8,
      }}
    >
      <h2 className="text-lg hidden lg:block w-min text-nowrap lg:text-lg-lg bg-linear-gradient bg-clip-text text-transparent leading-[1]">
        average popularity:
      </h2>
      <h2 className="text-xl lg:ml-4 w-fit lg:text-lg-lg text-white">
        <span className="bg-linear-gradient font-bold bg-clip-text text-transparent">
          {circlePopularityData.averagePopularity}
        </span>
        /100
      </h2>
      <span className="text-lg lg:text-lg font-bold bg-linear-gradient bg-clip-text text-transparent">
        users by obscurity:
      </span>
      <ul className="lg:h-[10vh] lg:ml-4 xl:h-[20vh] overflow-auto pointer-events-auto">
        {obscurityRanking}
      </ul>
    </motion.div>
  );
};
