import { Variants, motion } from "framer-motion";
import { ConsolidatedArtist } from "../helpers/consolidateTopArtistsWithPoints.helper";
import { useIsMobile } from "../../../providers/isMobile.provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { LINEAR_GRADIENT } from "../../../config/globals";
import { useState } from "react";

interface StackedBarProps {
  artistsData: ConsolidatedArtist[];
  className: string;
}

const artistDetailVariants: Variants = {
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

export const StackedBar: React.FC<StackedBarProps> = ({
  artistsData,
  className,
}) => {
  const isMobile = useIsMobile();
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [largestTitle, setLargestTitle] = useState<number>(-1);

  if (artistsData.length === 0) {
    return (
      <h2 className={`${className} text-lg lg:text-lg-lg text-white`}>
        Please select a user
      </h2>
    );
  }

  const handleBarClick = (index: number) => {
    setClickedIndex(index);
  };

  const artistNameVariants: Variants = {
    hover: {
      fontSize: isMobile ? "35px" : "48px",
      backgroundImage: LINEAR_GRADIENT,
      lineHeight: "50px",
      textWrap: "balance",
    },
  };

  const barVariants: Variants = {
    hover: {
      height: isMobile ? "60vh" : "60%",
    },
    inView: {
      opacity: [0.1, 1],
    },
  };

  const gradientBarVariants: Variants = {
    hover: isMobile
      ? {
          width: "5px",
        }
      : {},
  };

  const artistNameContainerVariants: Variants = {
    hover: {
      maxWidth: isMobile ? undefined : "70vw",
    },
  };

  const artistBar = artistsData.map((artist, i, { length }) => {
    const artistImage = artist.images === undefined ? "" : artist.images[0].url;
    const isClicked = clickedIndex === i;
    if (artist.weightedPoints * 2.5 > largestTitle) {
      setLargestTitle(artist.weightedPoints * 2.5);
    }
    return (
      <motion.div
        layout
        style={{
          height: `${artist.weightedPoints}%`,
        }}
        variants={barVariants}
        whileHover="hover"
        whileInView="inView"
        animate={isClicked ? "hover" : ""}
        className={`flex items-start min-h-12 lg:max-w-[50vw]`}
        key={artist.name}
        onClick={() => handleBarClick(i)}
        onMouseEnter={() => handleBarClick(i)}
      >
        <motion.div
          className="bg-linear-gradient w-28 lg:w-48 h-full flex-shrink-0"
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
            variants={artistNameContainerVariants}
          >
            <motion.a
              href={artist.url}
              target="_blank"
              variants={artistNameVariants}
              rel="noreferrer"
              title="Listen on Spotify"
              className="inline-block font-bold w-full overflow-ellipsis overflow-hidden bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(215deg, #ffffff 0%, #ffffff 55%, #ffffff 100%)",
                color: "rgba(0,0,0,0)",
                textWrap: "nowrap",
                fontSize: !isMobile
                  ? `${Math.max(artist.weightedPoints * 2.5, 24)}px`
                  : "1.5rem",
              }}
            >
              {i + 1}. {artist.name}{" "}
              <motion.span
                variants={spotifyVariants}
                style={{ color: "rgb(255 255 255)" }}
              >
                <FontAwesomeIcon icon={faSpotify} />
              </motion.span>
            </motion.a>
          </motion.div>
          <motion.div
            variants={artistDetailVariants}
            className="text-base text-white pl-6 pointer-events-[scroll] lg:max-w-[30vw] xl:max-w-[20vw] lg:overflow-y-auto"
            style={{ opacity: 0 }}
          >
            <motion.div className="w-1/2 lg:w-1/3">
              <img src={artistImage} alt={`${artist.name}`}></img>
            </motion.div>
            <motion.p
              variants={artistDetailVariants}
              className="leading-1 text-wrap bg-linear-gradient bg-clip-text text-transparent"
            >
              Contributors:{" "}
              <span className="text-white">
                {artist.contributors.join(", ")}
              </span>
              <br />
              Genres:
              <span className="text-white">
                {" "}
                {isMobile ? artist.genres[0] : artist.genres.join(", ")}
              </span>
              <br />
              Popularity:{" "}
              <span className="text-white">{artist.popularity}/100</span>
            </motion.p>
          </motion.div>
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
      {artistBar}
    </motion.div>
  );
};
