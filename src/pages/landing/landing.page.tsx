import { ReactNode, useEffect, useState } from "react";
import { BackgroundGradient } from "./components/background-gradient.component";
import React from "react";
import { SquirlComponent } from "./components/squirl.component";
import { SpotifyLoginState } from "./states/spotifylogin.state";
import { AnotherLoginState } from "./states/anotherLoginState";
import queryString from "query-string";
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from "../../config/globals";

interface stateInterface {
  component: ReactNode;
  squirlYOffset: string | undefined;
}

interface statesInterface {
  [key: string]: stateInterface;
}

export const LandingPage: React.FC = () => {
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

    setBackgroundAlt(!backgroundAlt);
  };
  const states: statesInterface = {
    initSpotifyLogin: {
      component: SpotifyLoginState({ nextState: startLoginFlow }),
      squirlYOffset: "0vh",
    },
    anotherLoginState: {
      component: AnotherLoginState({}),
      squirlYOffset: "-40vh",
    },
  };

  const [currentState, setCurrentState] = useState<stateInterface>(
    () => states.initSpotifyLogin
  );

  const [backgroundAlt, setBackgroundAlt] = useState<boolean>(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const loginCode = params.get("code");
    const error = params.get("error");

    if (error !== null) {
      console.error(error);
      return;
    }

    if (loginCode === null || currentState !== states.initSpotifyLogin) {
      return;
    }

    console.log("oh yeahhh");

    params.delete("code");
    setCurrentState(states.anotherLoginState);
  }, [currentState, states.anotherLoginState, states.initSpotifyLogin]);

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
      {currentState.component}
      <BackgroundGradient alt={backgroundAlt} />
    </div>
  );
};
