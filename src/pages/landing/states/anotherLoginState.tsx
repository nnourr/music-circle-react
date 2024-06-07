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
