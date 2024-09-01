import { Variants, motion } from "framer-motion";
import { useIsMobile } from "../../../providers/isMobile.provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import {
  ConsolidatedArtist,
  ConsolidatedTrack,
} from "../models/consolidatedItems.model";

type Item = ConsolidatedArtist | ConsolidatedTrack;

interface StackedBarProps {
  itemsData: Item[] | undefined;
  className: string;
}

const detailVariants: Variants = {
  hover: {
    opacity: 1,
  },
};

const noVariants: Variants = {};

const spotifyVariants: Variants = {
  hover: {
    color: "rgb(30,215,96)",
  },
};

const barVariants: Variants = {
  hover: {
    height: "60vh",
  },
};

export const StackedBar: React.FC<StackedBarProps> = ({
  itemsData,
  className,
}) => {
  const isMobile = useIsMobile();
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const createItemDetails = (item: Item) => {
    const itemImage = item.images?.[0]?.url;
    const isArtist = "genres" in item;

    return (
      <motion.div
        variants={detailVariants}
        className="text-base text-white pl-6 pointer-events-[scroll] w-full lg:overflow-y-auto"
        style={{ opacity: 0 }}
      >
        <motion.div className="w-1/2 lg:w-1/3">
          <a href={item.url} target="_blank">
            <img src={itemImage} alt={`${item.name}`} />
          </a>
        </motion.div>
        <motion.p
          variants={detailVariants}
          className="leading-1 text-wrap bg-linear-gradient bg-clip-text text-transparent"
        >
          Contributors:{" "}
          <span className="text-white">{item.contributors.join(", ")}</span>
          <br />
          Popularity:{" "}
          <span className="text-white">{item.popularity / 100}</span>
          <br />
          {isArtist ? (
            <>
              Genres:{" "}
              <span className="text-white">
                {isMobile ? item.genres[0] : item.genres.join(", ")}
              </span>
              <br />
            </>
          ) : (
            <>
              Artist{item.artists.length > 1 && "s"}:{" "}
              <span className="text-white">
                {isMobile
                  ? item.artists[0].name
                  : item.artists.map((artist) => artist.name).join(", ")}
              </span>
              <br />
            </>
          )}
        </motion.p>
      </motion.div>
    );
  };

  if (!!!itemsData || itemsData.length === 0) {
    return (
      <h2 className={`${className} text-lg lg:text-lg-lg text-white`}>
        Please select a member
      </h2>
    );
  }

  const handleBarClick = (index: number) => {
    localStorage.setItem("firstTime", "false");
    setClickedIndex(index);
  };

  const itemVariants: Variants = {
    hover: {
      fontSize: isMobile ? "35px" : "48px",
      lineHeight: "50px",
      textWrap: "balance",
    },
  };

  const gradientBarVariants: Variants = {
    hover: isMobile
      ? {
          width: "5px",
        }
      : {},
  };

  const itemDetailVariants: Variants = {
    hover: {
      maxWidth: isMobile ? undefined : "70vw",
    },
  };

  const isFirstTime = localStorage.getItem("firstTime") === "true";
  const itemBars = itemsData.map((item, i, { length }) => {
    const isClicked = clickedIndex === i;
    const firstTimePulse =
      isFirstTime && i === 0 && !isClicked
        ? "animate-borderPulse transition-all border-white/70"
        : "";

    return (
      <motion.div
        layout
        style={{
          height: `${item.weightedPoints}vh`,
        }}
        variants={barVariants}
        whileHover="hover"
        animate={isClicked ? "hover" : ""}
        className={`flex items-start min-h-12`}
        key={item.name}
        onClick={() => handleBarClick(i)}
        onMouseEnter={() => handleBarClick(i)}
      >
        <motion.div
          className={`bg-linear-gradient w-24 lg:w-48 h-full flex-shrink-0 ${firstTimePulse}`}
          style={{
            opacity: `${100 - (i / length) * 100}%`,
            borderTopLeftRadius: `${i === 0 ? "20px" : ""}`,
            borderTopRightRadius: `${i === 0 ? "20px" : ""}`,
            borderBottomRightRadius: `${i === length - 1 ? "20px" : ""}`,
            borderBottomLeftRadius: `${i === length - 1 ? "20px" : ""}`,
            maxWidth: isMobile ? "unset" : "12rem",
          }}
          variants={gradientBarVariants}
        />
        <motion.div
          variants={noVariants}
          className="flex flex-col items-start h-full overflow-hidden"
        >
          <motion.div
            layout
            className="ml-4 flex-shrink-0"
            style={{
              width: "100%",
              maxWidth: isMobile ? undefined : "50vw",
            }}
            variants={itemDetailVariants}
          >
            <motion.a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              title="Listen on Spotify"
              className="inline-block w-full"
            >
              <motion.span
                className="font-bold inline-block max-w-full overflow-ellipsis overflow-hidden text-white"
                variants={itemVariants}
                style={{
                  textWrap: "nowrap",
                  fontSize: !isMobile
                    ? `${Math.max(item.weightedPoints * 2.5, 24)}px`
                    : "24px",
                }}
              >
                {i + 1}. {item.name}{" "}
                <motion.span
                  variants={spotifyVariants}
                  style={{ color: "rgb(255 255 255)" }}
                >
                  <FontAwesomeIcon icon={faSpotify} />
                </motion.span>
              </motion.span>
            </motion.a>
          </motion.div>
          {createItemDetails(item)}
        </motion.div>
      </motion.div>
    );
  });

  return (
    <motion.div
      onMouseLeave={() => setClickedIndex(null)}
      className={`${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {itemBars}
    </motion.div>
  );
};
