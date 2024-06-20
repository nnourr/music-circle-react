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

const SpotifyLoginState = React.forwardRef<
  HTMLDivElement,
  SpotifyLoginStateProps
>(({ nextState, isLoading }, ref) => {
  const isFirstTime = localStorage.getItem("firstTime") === "true";
  return (
    <div
      ref={ref}
      className="h-full w-full flex justify-center items-center flex-col gap-12 lg:gap-24 opacity-100"
    >
      <div className="w-min">
        <h1 className="text-3xl text-center lg:text-nowrap lg:text-lg-3xl font-fancy text-black/80">
          Music Circle.
        </h1>
        {isFirstTime && (
          <p className="m-3 text-base font-sans leading-none text-black/80">
            Curious about your friends' true music tastes?
          </p>
        )}
      </div>

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
  );
});

const MotionSpotifyLoginState = motion(SpotifyLoginState, {
  forwardMotionProps: true,
});

export default MotionSpotifyLoginState;
