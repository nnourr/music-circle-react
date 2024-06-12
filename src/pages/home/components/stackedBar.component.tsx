import { color, motion } from "framer-motion";
import { ConsolidatedArtist } from "../helpers/consolidateTopArtistsWithPoints.helper";
import { useIsMobile } from "../../../providers/isMobile.provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import {
  LINEAR_GRADIENT_BREATHE_1,
  LINEAR_GRADIENT_BREATHE_2,
} from "../../../config/globals";

interface StackedBarProps {
  artistsData: ConsolidatedArtist[];
  className: string;
}

const nameVariants = {
  hover: {
    backgroundImage: [LINEAR_GRADIENT_BREATHE_1, LINEAR_GRADIENT_BREATHE_2],
    color: "rgba(0,0,0,0)",
  },
};

const barVariants = {
  hover: {
    height: "50%",
  },
  inView: {
    opacity: [0.1, 1],
  },
};

const artistDetailVariants = {
  hover: {
    opacity: 1,
  },
};

const noVariants = {};

const spotifyVariants = {
  hover: {
    color: "rgb(30,215,96)",
  },
};

export const StackedBar: React.FC<StackedBarProps> = ({
  artistsData,
  className,
}) => {
  const isMobile = useIsMobile();

  const artistBar = artistsData.map((artist, i, { length }) => {
    // fix this
    const artistImage = artist.images === undefined ? "" : artist.images[0].url;
    return (
      <motion.div
        style={{
          height: `${artist.weightedPoints}%`,
        }}
        variants={barVariants}
        whileHover="hover"
        whileInView="inView"
        whileTap="hover"
        className={`flex items-start min-h-12`}
        key={artist.name}
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
          variants={noVariants}
        />
        <motion.div variants={noVariants} className="flex flex-col items-start">
          <motion.div
            className="text-white/90 ml-4 text-nowrap w-[30rem] flex-shrink-0 overflow-auto"
            variants={nameVariants}
            style={{
              fontSize: !isMobile
                ? `${Math.max(artist.weightedPoints * 2.5, 24)}px`
                : "24px",
              backgroundImage: "rgba(255,255,255,0.8)",
              backgroundClip: "text",
            }}
          >
            {i + 1}. {artist.name}{" "}
            <motion.a
              href={artist.url}
              target="_blank"
              variants={spotifyVariants}
              rel="noreferrer"
              title="Listen on Spotify"
              className="opacity-90 text-white"
            >
              <FontAwesomeIcon icon={faSpotify} />
            </motion.a>
          </motion.div>
          <motion.div
            variants={artistDetailVariants}
            className="text-base text-white pl-6"
            style={{ opacity: 0 }}
          >
            <motion.div className="w-1/3">
              <img src={artistImage} alt={`${artist.name}`}></img>
            </motion.div>
            <motion.p variants={artistDetailVariants}>
              Contributors: {artist.contributors}
              <br />
              Popularity: {artist.popularity}
              <br />
              Genres: {artist.genres}
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  });
  return <motion.div className={`${className}`}>{artistBar}</motion.div>;
};
