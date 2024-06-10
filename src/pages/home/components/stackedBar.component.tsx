import { motion } from "framer-motion";
import { ConsolidatedArtist } from "../helpers/consolidateTopArtistsWithPoints.helper";
import { useIsMobile } from "../../../providers/isMobile.provider";

interface StackedBarProps {
  artistsData: ConsolidatedArtist[];
  className: string;
}

export const StackedBar: React.FC<StackedBarProps> = ({
  artistsData,
  className,
}) => {
  const isMobile = useIsMobile();
  const artistBar = artistsData.map((artist, i, { length }) => {
    return (
      <motion.div
        style={{
          height: `${artist.weightedPoints}%`,
        }}
        whileInView={{ opacity: [0.1, 1] }}
        className={`flex items-start min-h-12`}
        key={artist.artistName}
      >
        <motion.div
          className="bg-linear-gradient w-1/2 h-full flex-shrink-0"
          style={{
            opacity: `${100 - (i / length) * 100}%`,
            borderTopLeftRadius: `${i === 0 ? "20px" : ""}`,
            borderTopRightRadius: `${i === 0 ? "20px" : ""}`,
            borderBottomRightRadius: `${i === length - 1 ? "20px" : ""}`,
            borderBottomLeftRadius: `${i === length - 1 ? "20px" : ""}`,
            maxWidth: isMobile ? "unset" : "12rem",
          }}
        />
        <div
          className="text-white/90 ml-4 text-nowrap overflow-auto"
          style={{
            fontSize: !isMobile
              ? `${Math.max(artist.weightedPoints * 2.5, 24)}px`
              : "24px",
          }}
        >
          {i + 1}. {artist.artistName}
        </div>
      </motion.div>
    );
  });
  return <motion.div className={`${className}`}>{artistBar}</motion.div>;
};
