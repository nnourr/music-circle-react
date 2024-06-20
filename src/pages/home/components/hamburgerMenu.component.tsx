import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "../../../providers/isMobile.provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { createSearchParams, useNavigate } from "react-router-dom";
import Button, {
  btnSizes,
} from "../../../components/inputs/button.input.component";
import { ReactNode, useState } from "react";
import { ModalComponent } from "../../../components/modal.component";
import { UserCircleListComponent } from "./userCircleList.component";

interface HamburgerMenuProps {
  currentCircleCode: string | undefined;
  setCurrentCircle: (circleCode: string) => any;
  close: () => any;
}
export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  currentCircleCode,
  close,
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [showSignOut, setShowSignOut] = useState<boolean>(false);

  const signOutModalText: ReactNode = (
    <h2>Are you sure you want to sign out?</h2>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: [null, 0] }}
      className="h-full w-full z-50 bg-black/60 absolute top-0 left-0"
    >
      <AnimatePresence>
        {showSignOut ? (
          <ModalComponent
            cancelAction={{
              actionText: "No, Stay Signed In",
              actionTitle: "I do not want to sign out",
              onAction: () => {
                setShowSignOut(false);
              },
            }}
            confirmAction={{
              actionText: "Yes, Sign Out",
              actionTitle: "I want to sign out",
              onAction: () => {
                localStorage.removeItem("user");
                window.location.reload();
              },
            }}
            promptText={signOutModalText}
            onClose={() => setShowSignOut(false)}
            key={"SignOutModal"}
          />
        ) : (
          ""
        )}
      </AnimatePresence>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: isMobile ? "100%" : "34rem" }}
        className="bg-black flex flex-col h-full px-8 lg:px-14 py-9"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="h-full flex flex-col items-start"
        >
          <button onClick={close} className="absolute left-5 top-2 w-7 h-7" />
          <div className="flex w-full justify-between">
            <button onClick={close}>
              <FontAwesomeIcon
                icon={faClose}
                className="text-white/90 text-lg lg:text-lg-lg"
              />
            </button>
            <button
              title="Sign Out"
              className="text-base lg:text-lg-base text-error/90"
              onClick={() => {
                setShowSignOut(true);
              }}
            >
              Sign out{" "}
              <FontAwesomeIcon
                className="ml-2"
                icon={faArrowRightFromBracket}
              />
            </button>
          </div>
          <h2 className="bg-linear-gradient my-4 bg-clip-text leading-[1] font-fancy text-transparent text-xl lg:text-lg-xl">
            Your Circles
          </h2>
          <UserCircleListComponent
            currentCircleCode={currentCircleCode}
            onCircleClick={close}
            className="overflow-y-auto h-full w-full"
            btnSize={btnSizes.md}
          />

          <Button
            className="w-full"
            white={true}
            btnSize={btnSizes.md}
            title="Join or Create Circle"
            onClick={() => {
              navigate({
                pathname: "/joinCircle",
                search: createSearchParams({ noRedirect: "true" }).toString(),
              });
            }}
          >
            add circle{" "}
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="rotate-45 translate-y-[2px] ml-2"
            />
          </Button>
        </motion.div>
      </motion.div>
      <motion.div
        key="gradient menu background"
        className="h-full w-full bg-linear-gradient opacity-60 -z-10 absolute top-0 left-0"
        onClick={close}
      ></motion.div>
    </motion.div>
  );
};
