import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useUser } from "../../../providers/user.provider";
import { useIsMobile } from "../../../providers/isMobile.provider";

interface NavbarComponentInterface {
  menuClicked: () => any;
}

export const NavbarComponent: React.FC<NavbarComponentInterface> = ({
  menuClicked,
}) => {
  const [showUsername, setShowUsername] = useState<boolean>(false);
  const { username } = useUser();
  const isMobile = useIsMobile();

  return (
    <motion.div
      className="text-lg lg:text-lg-lg font-fancy top-0 left-0 px-5 py-2 lg:py-0 w-full bg-linear-gradient"
      onHoverStart={() => setShowUsername(true)}
      onHoverEnd={() => setShowUsername(false)}
    >
      <button onClick={menuClicked}>
        <FontAwesomeIcon icon={faBars} className="mr-4" />
      </button>
      <AnimatePresence mode="wait">
        {showUsername ? (
          <motion.span
            key="username"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: [null, 0], transition: { duration: 0.1 } }}
            transition={{ duration: 0.3 }}
          >
            hey, {username}
          </motion.span>
        ) : (
          <motion.span
            key="musicCircle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: [null, 0], transition: { duration: 0.1 } }}
            transition={{ duration: 0.3 }}
          >
            Music Circle
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
