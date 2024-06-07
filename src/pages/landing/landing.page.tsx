import { ReactNode, useEffect, useState } from "react";
import { BackgroundGradient } from "./components/background-gradient.component";
import React from "react";
import { SquirlComponent } from "./components/squirl.component";
import { AnotherLoginState } from "./states/anotherLoginState";
import queryString from "query-string";
import {
  SERVER_ENDPOINT,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
} from "../../config/globals";
import { useUser } from "../../providers/user.provider";
import { JoinCircleState } from "./states/joinCircleState";
import { AnimatePresence } from "framer-motion";
import MotionSpotifyLoginState from "./states/spotifylogin.state";

interface stateInterface {
  id: string;
  squirlYOffset: string | undefined;
  backgroundAlt: boolean;
}

interface statesInterface {
  spotifyLoginState: stateInterface;
  joinCircleState: stateInterface;
  anotherLoginState: stateInterface;
}

export const LandingPage: React.FC = () => {
  const { email, setEmail, setUsername } = useUser();

  const scope = "user-top-read user-read-email";
  const startLoginFlow = () => {
    window.location.href =
      "https://accounts.spotify.com/authorize?" +
      queryString.stringify({
        response_type: "code",
        client_id: SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        state: "hdickalporhfsjcy",
      });
  };
  const states: statesInterface = {
    spotifyLoginState: {
      id: "SpotifyLoginState",
      squirlYOffset: "-1vh",
      backgroundAlt: true,
    },
    joinCircleState: {
      id: "JoinCircleState",
      squirlYOffset: "-40vh",
      backgroundAlt: false,
    },
    anotherLoginState: {
      id: "AnotherLoginState",
      squirlYOffset: "-40vh",
      backgroundAlt: false,
    },
  };

  const [currentState, setCurrentState] = useState<stateInterface>(
    () => states.spotifyLoginState
  );

  useEffect(() => {
    const handleUserLogin = async (loginCode: string) => {
      const setUserResponse = await fetch(SERVER_ENDPOINT + "/user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loginCode: loginCode }),
      });

      if (setUserResponse.status === 200) {
        const userObj = await setUserResponse.json();
        const email = userObj.email;
        if (email === undefined) {
          console.error("email not found");
          return;
        }
        setEmail(userObj.email);
        setUsername(userObj.username);
      }
    };
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const loginCode = params.get("code");
    const error = params.get("error");

    if (error !== null) {
      console.error(error);
      return;
    }

    if (
      loginCode === null ||
      currentState !== states.spotifyLoginState ||
      !email
    ) {
      return;
    }

    console.log("oh yeahhh");
    params.delete("code");

    handleUserLogin(loginCode);
    setCurrentState(states.joinCircleState);
  }, [
    currentState,
    states.spotifyLoginState,
    states.joinCircleState,
    setEmail,
    setUsername,
    email,
  ]);

  return (
    <div className="h-full w-full overflow-hidden">
      <SquirlComponent
        yOffset={currentState.squirlYOffset}
        className="relative left-[4%]"
      />
      <SquirlComponent
        yOffset={currentState.squirlYOffset}
        className="relative right-[4%]"
        flip={true}
      />
      <AnimatePresence>
        {currentState.id === states.spotifyLoginState.id ? (
          <MotionSpotifyLoginState
            key={states.spotifyLoginState.id}
            nextState={startLoginFlow}
            animate={{ translateY: 0, opacity: 1 }}
            initial={{
              translateY: "3%",
            }}
            exit={{
              opacity: 0,
              translateY: "-10%",
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        ) : currentState.id === states.joinCircleState.id ? (
          <JoinCircleState
            key={states.joinCircleState.id}
            nextState={() => {}}
            goToCreateCircle={() => {
              setCurrentState(states.anotherLoginState);
            }}
          />
        ) : (
          "hey there, you're not meant to see this!"
        )}
      </AnimatePresence>
      <BackgroundGradient alt={currentState.backgroundAlt} />
    </div>
  );
};
