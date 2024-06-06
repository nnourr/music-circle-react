import queryString from "query-string";
import { useEffect } from "react";
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
} from "../../../config/globals";
import Button from "../../../components/inputs/button.input.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

export const AnotherLoginState: React.FC = () => {
  return (
    <div className="h-full w-full flex justify-center items-center flex-col gap-24">
      <h1 className="text-2xl font-fancy text-black/80">ANOTHER OHE.</h1>

      <div>
        Sign-In With{" "}
        <FontAwesomeIcon className="!align-text-bottom" icon={faSpotify} />
      </div>
    </div>
  );
};
