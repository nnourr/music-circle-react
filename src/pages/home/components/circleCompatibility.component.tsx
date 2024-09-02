import { motion } from "framer-motion";
import { CompatibilityResult } from "../helpers/getCircleCompatibility";
import { useIsMobile } from "../../../providers/isMobile.provider";
import { UserInterface } from "../models/user.model";
import { useState } from "react";
import { PairwiseCompatibility } from "./pairwiseCompatibility.component";
import Button, {
  btnSizes,
} from "../../../components/inputs/button.input.component";

interface CircleCompatibilityProps {
  circleCompatibilityData: CompatibilityResult | undefined;
  users: UserInterface[];
  className?: string;
  item: string;
}

export const CircleCompatibility: React.FC<CircleCompatibilityProps> = ({
  circleCompatibilityData,
  className,
  users,
  item,
}) => {
  const isMobile = useIsMobile();
  const [listToggle, setListToggle] = useState<boolean>(false);

  if (
    !!!circleCompatibilityData ||
    isNaN(circleCompatibilityData.groupCompatibility)
  ) {
    return (
      <>
        {isMobile ? (
          <h2 className={`${className} text-lg lg:text-lg-lg text-white`}>
            Please select a member
          </h2>
        ) : (
          <h2 className="text-lg lg:block w-min font-bold text-nowrap lg:text-lg-lg text-transparent leading-none relative after:w-full after:h-full after:animate-pulse after:absolute after:top-0 after:right-0 after:bg-spotify/15 after:rounded-3xl after:block">
            circle compatibility
          </h2>
        )}
      </>
    );
  }

  const userPopularityRanking = circleCompatibilityData.compatibilityMatrix.map(
    (pairwiseCompatibility, i) => (
      <li
        className="text-base lg:text-base font-normal text-white"
        key={`${pairwiseCompatibility.user1Name}+${pairwiseCompatibility.user2Name}`}
      >
        {i + 1}. {pairwiseCompatibility.user1Name} x{" "}
        {pairwiseCompatibility.user2Name}:{" "}
        <span className="bg-linear-gradient font-bold bg-clip-text text-transparent">
          {pairwiseCompatibility.compatibilityPercentage}
        </span>
        %
      </li>
    )
  );

  const isFirstTime = localStorage.getItem("firstTime") === "true";

  return (
    <motion.div
      className={`${className} font-bold text-left flex-grow flex-shrink overflow-hidden flex flex-col`}
      initial={{ opacity: 0 }}
      animate={{
        opacity:
          circleCompatibilityData.compatibilityMatrix.length === 0 ? 0 : 1,
      }}
    >
      <h2 className="text-lg hidden lg:block w-min text-nowrap lg:text-lg-lg bg-linear-gradient bg-clip-text text-transparent leading-none">
        circle compatibility
      </h2>
      {isFirstTime && (
        <span className="text-white text-sm lg:text-base font-normal">
          (this is your circle's compatibility, based on the {item} you listen
          to)
        </span>
      )}
      <h2 className="text-xl lg:px-4 w-full lg:text-lg-lg text-white flex items-center justify-between">
        <div>
          <span className="bg-linear-gradient font-bold bg-clip-text text-transparent">
            {circleCompatibilityData.groupCompatibility}
          </span>
          %
        </div>
        <Button
          btnSize={btnSizes.sm}
          title="toggle list"
          onClick={() => setListToggle((toggle) => !toggle)}
          white={true}
          className="px-4 font-normal"
        >
          {listToggle ? "pairwise" : "list"}
        </Button>
      </h2>
      {listToggle ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-lg lg:text-lg font-bold bg-linear-gradient bg-clip-text text-transparent w-fit">
            users by compatibility
          </p>
          {isFirstTime && (
            <span className="text-white text-sm lg:text-base font-normal">
              (this is the compatibility of each person with each other person)
            </span>
          )}
          <ul className="lg:ml-4 overflow-auto lg:max-h-52 mb-4 lg-mb-0 w-fit">
            {userPopularityRanking}
          </ul>
        </motion.div>
      ) : (
        <PairwiseCompatibility
          item={item}
          circleCompatibilityData={circleCompatibilityData}
          users={users}
        />
      )}
    </motion.div>
  );
};
