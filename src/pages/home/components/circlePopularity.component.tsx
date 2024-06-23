import { motion } from "framer-motion";
import { PopularityData } from "../helpers/getCirclePopularity";

interface CirclePopularityProps {
  itemPopularityData: PopularityData;
  className?: string;
}

export const CirclePopularity: React.FC<CirclePopularityProps> = ({
  itemPopularityData,
  className,
}) => {
  const userPopularityRanking = itemPopularityData.userPopularityRanking.map(
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
  const isFirstTime = localStorage.getItem("firstTime") === "true";

  return (
    <motion.div
      key="itemPopularityData"
      className={`${className} font-bold text-left flex-grow flex-shrink overflow-hidden flex flex-col`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: itemPopularityData.averagePopularity === 0 ? 0 : 0.8,
      }}
    >
      <h2 className="text-lg hidden lg:block w-min text-nowrap lg:text-lg-lg bg-linear-gradient bg-clip-text text-transparent leading-none">
        average popularity:
      </h2>
      {isFirstTime && (
        <span className="text-white text-sm lg:text-base font-normal">
          (this is the average popularity of everyone's top 50 artists)
        </span>
      )}
      <h2 className="text-xl lg:ml-4 w-fit lg:text-lg-lg text-white">
        <span className="bg-linear-gradient font-bold bg-clip-text text-transparent">
          {itemPopularityData.averagePopularity}
        </span>
        /100
      </h2>
      <p className="text-lg lg:text-lg font-bold bg-linear-gradient bg-clip-text text-transparent">
        users by popularity:
      </p>
      {isFirstTime && (
        <span className="text-white text-sm lg:text-base font-normal">
          (this is the average popularity of each person's top 50 artists)
        </span>
      )}
      <ul className="lg:ml-4 overflow-auto pointer-events-auto mb-4 lg-mb-0">
        {userPopularityRanking}
      </ul>
    </motion.div>
  );
};
