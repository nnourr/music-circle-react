import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <motion.footer
      className={`${className} bg-black relative w-full h-fit p-8 lg:p-16 flex flex-col gap-12 lg:flex-row justify-between`}
    >
      <div className="bg-linear-gradient h-2 w-full absolute top-0 left-0"></div>
      <div>
        <div className="flex items-baseline gap-2 lg:gap-4 leading-none">
          <div className="rounded-full bg-radial-gradient-alt h-6 lg:h-10 aspect-square" />
          <span className="bg-linear-gradient bg-clip-text text-transparent font-fancy text-1xl lg:text-lg-1xl text-nowrap">
            Music Circle.
          </span>
        </div>
        <span className="text-white/90 text-base lg:text-lg-base">
          created by{" "}
          <a
            href="https://www.nnourr.tech"
            target="_blank"
            rel="noreferrer"
            className="text-pink-600"
          >
            nnourr.tech
          </a>
        </span>
      </div>
      <div className="flex flex-col text-sm text-white/80 justify-center lg:gap-4 lg:items-end">
        <Link to="/privacy" className="underline">
          privacy policy
        </Link>
        <span>
          not related to Spotify AB or any of it's partners in any way
        </span>
      </div>
    </motion.footer>
  );
};
