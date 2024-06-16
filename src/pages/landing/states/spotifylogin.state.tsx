import { motion } from "framer-motion";
import Button from "../../../components/inputs/button.input.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import React from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface SpotifyLoginStateProps {
  nextState: () => void;
  isLoading: boolean;
}

// Forward ref to the DOM element you want to animate
const SpotifyLoginState = React.forwardRef<
  HTMLDivElement,
  SpotifyLoginStateProps
>(({ nextState, isLoading }, ref) => (
  <div
    ref={ref}
    className="h-full w-full flex justify-center items-center flex-col gap-12 lg:gap-24 opacity-100"
  >
    <h1 className="text-3xl px-7 lg:text-lg-3xl font-fancy text-black/80">
      Music Circle.
    </h1>

    <Button
      title="Sign in with Spotify"
      onClick={() => (isLoading ? () => {} : nextState())}
    >
      {!isLoading ? (
        <>
          Sign-In With{" "}
          <FontAwesomeIcon className="!align-text-bottom" icon={faSpotify} />
        </>
      ) : (
        <FontAwesomeIcon className="animate-spin" icon={faSpinner} />
      )}
    </Button>
  </div>
));

const MotionSpotifyLoginState = motion(SpotifyLoginState, {
  forwardMotionProps: true,
});

export default MotionSpotifyLoginState;
