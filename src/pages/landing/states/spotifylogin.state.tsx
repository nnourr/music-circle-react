import { motion } from "framer-motion";
import Button from "../../../components/inputs/button.input.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import React from "react";

interface SpotifyLoginStateProps {
  nextState: () => void;
}

// Forward ref to the DOM element you want to animate
const SpotifyLoginState = React.forwardRef<
  HTMLDivElement,
  SpotifyLoginStateProps
>(({ nextState }, ref) => (
  <div
    ref={ref}
    className="h-full w-full flex justify-center items-center flex-col gap-24"
  >
    <h1 className="text-2xl font-fancy text-black/80">Music Circle.</h1>

    <Button onClick={() => nextState()}>
      Sign-In With{" "}
      <FontAwesomeIcon className="!align-text-bottom" icon={faSpotify} />
    </Button>
  </div>
));

// Create a motion component by wrapping the SpotifyLoginState with the motion() function
const MotionSpotifyLoginState = motion(SpotifyLoginState, {
  forwardMotionProps: true,
});

export default MotionSpotifyLoginState;
