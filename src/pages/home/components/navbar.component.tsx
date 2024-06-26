import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useUser } from "../../../providers/user.provider";
import { useNavigate } from "react-router-dom";

interface NavbarComponentInterface {
  menuClicked: () => any;
}

export const NavbarComponent: React.FC<NavbarComponentInterface> = ({
  menuClicked,
}) => {
  const [showUsername, setShowUsername] = useState<boolean>(false);
  const { username } = useUser();
  const navigate = useNavigate();

  return (
    <motion.div
      className="text-lg lg:text-lg-lg sticky font-fancy top-0 left-0 px-5 z-50 pt-2 lg:py-0 w-full bg-linear-gradient"
      onHoverStart={() => setShowUsername(true && !!username)}
      onHoverEnd={() => setShowUsername(false)}
    >
      <button title="Expand Hamburger Menu" onClick={menuClicked}>
        <FontAwesomeIcon icon={faBars} className="mr-4 text-black/80" />
      </button>
      <AnimatePresence mode="wait">
        <motion.span
          key={`${showUsername}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.4 }}
          className="cursor-pointer w-full"
          onClick={() => navigate("/home")}
        >
          {showUsername ? `hey, ${username}.` : "Music Circle."}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
};
