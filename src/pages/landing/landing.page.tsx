import { useEffect, useState } from "react";
import { BackgroundGradient } from "./components/background-gradient.component";
import React from "react";
import { SquirlComponent } from "./components/squirl.component";
import queryString from "query-string";
import {
  SERVER_ENDPOINT,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
} from "../../config/globals";
import { useUser } from "../../providers/user.provider";
import { AnimatePresence } from "framer-motion";
import MotionSpotifyLoginState from "./states/spotifylogin.state";
import { userLoginInterface } from "./models/userLogin.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/inputs/button.input.component";
import MotionJoinCircleState from "./states/joinCircleState";

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
  const [pageError, setPageError] = useState<string | undefined>();

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
      try {
        const setUserResponse = await fetch(SERVER_ENDPOINT + "/user/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ loginCode: loginCode }),
        });

        if (setUserResponse.status === 200) {
          const userObj = (await setUserResponse.json()) as userLoginInterface;
          const email = userObj.email;
          const username = userObj.username;
          if (!!!email || !!!username) {
            throw new Error("email or username not found in response");
          }
          setEmail(email);
          setUsername(userObj.username);
          setCurrentState(states.joinCircleState);
        } else {
          throw new Error("setUser response not 200");
        }
      } catch (error) {
        setPageError("problem signing in.");
        console.error("Problem signing user into service " + error);
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

    if (loginCode === null || currentState !== states.spotifyLoginState) {
      return;
    }
    handleUserLogin(loginCode);
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
        className={`relative left-[4%] transition-opacity duration-700 delay-500 ${
          !!pageError ? "opacity-0" : "opacity-100"
        }`}
      />
      <SquirlComponent
        yOffset={currentState.squirlYOffset}
        className={`relative right-[4%] transition-opacity duration-700 delay-500 ${
          !!pageError ? "opacity-0" : "opacity-100"
        }`}
        flip={true}
      />
      {!!pageError ? (
        <div className=" w-3/5 h-full flex items-center justify-center text-xl text-red-600/90 m-auto flex-col">
          <div>
            <FontAwesomeIcon icon={faWarning} className="mr-8" /> {pageError}
          </div>
          <Button
            onClick={() => (window.location.href = window.location.pathname)}
          >
            try again
          </Button>
        </div>
      ) : (
        <AnimatePresence>
          {currentState.id === states.spotifyLoginState.id ? (
            <MotionSpotifyLoginState
              key={states.spotifyLoginState.id}
              nextState={startLoginFlow}
              animate={{ opacity: 1 }}
              style={{ opacity: 0 }}
              exit={{
                opacity: 0,
                translateY: "-10%",
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          ) : currentState.id === states.joinCircleState.id ? (
            <MotionJoinCircleState
              key={states.joinCircleState.id}
              nextState={() => {}}
              goToCreateCircle={() => {
                setCurrentState(states.anotherLoginState);
              }}
              animate={{ translateY: 0, opacity: 1 }}
              initial={{
                translateY: "30%",
              }}
              exit={{
                opacity: 0,
                translateY: "-10%",
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          ) : (
            "hey there, you're not meant to see this!"
          )}
        </AnimatePresence>
      )}
      <BackgroundGradient
        alt={currentState.backgroundAlt}
        error={!!pageError}
      />
    </div>
  );
};
