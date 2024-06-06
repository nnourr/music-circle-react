import queryString from "query-string";
import {
  SERVER_ENDPOINT,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
} from "../../config/globals";
import { useEffect, useState } from "react";
import ArtistsTable from "../../components/artistsTable.component";

export const HomePage = () => {
  const [initialCircle, setInitialCircle] = useState<string>("");
  const [userCircles, setUserCircles] = useState<string[]>([]);
  const [currentCircleInfo, setCurrentCircleInfo] = useState<any>({});
  const [userEmail, setUserEmail] = useState<string>("");
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

  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  const handleInitialCircle = (field: string) => {
    setInitialCircle(field);
  };

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
      window.sessionStorage.setItem("userEmail", email);
      const sessionEmail = window.sessionStorage.getItem("userEmail")
      if (sessionEmail === null) {
        console.error("error setting email session storage");
        return
      }
      setUserEmail(sessionEmail);
    }
  };

  const handleCreateNewCircle = async (circleName: string) => {
    try {
      const newCircleResponse = await fetch(
        SERVER_ENDPOINT + "/circle/" + circleName,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (newCircleResponse.status === 200) {
        const newCircleCode: string = await newCircleResponse.json();
        await handleAddUserToCircle(newCircleCode);
        setUserCircles([...userCircles, newCircleCode]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUserToCircle = async (circleCode: string) => {
    if (circleCode === "") {
      return;
    }
    try {
      await fetch(SERVER_ENDPOINT + `/user/${userEmail}/circle/${circleCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loginCode = params.get("code");
    const error = params.get("error");

    if (error !== null) {
      console.error(error);
      return;
    }
    if (loginCode === null || userEmail !== "") {
      return;
    }

    handleUserLogin(loginCode);
    params.delete("code");
  });

  useEffect(() => { 
    const callback = async () => {
      const getUserResponse = await fetch(`${SERVER_ENDPOINT}/user/${userEmail}`);
      const user = await getUserResponse.json();
  
      setUserCircles(user.circles);
    }
    if (userEmail === "") {
      return
    }
    callback()
  }, [userEmail])

  useEffect(() => {
    if (userCircles.length === 0) {
      return
    }
    const callback = async () => {
      const getCircleInfoResponse = await fetch(`${SERVER_ENDPOINT}/circle/${userCircles[0]}`)
      const circleInfo = await getCircleInfoResponse.json()

      setCurrentCircleInfo(circleInfo)
    }
    callback()
  }, [userCircles])

  return (
    <div className="h-full flex flex-col justify-center items-center">
      {userCircles.length === 0 ? (
        userEmail === "" ? (
          <>
            <button
              onClick={() => {
                startLoginFlow();
              }}
            >
              login to spotify
            </button>
          </>
        ) : (
          <div className="h-full flex  justify-center items-center">
            <label>
              new circle name:
              <input
                type="text"
                onChange={(change) => {
                  handleInitialCircle(change.target.value);
                }}
              />
            </label>
            <button
              type="submit"
              onClick={() => handleCreateNewCircle(initialCircle)}
            >
              submit
            </button>
          </div>
        )
      ) : (<pre className="overflow-y-auto">
        {JSON.stringify(currentCircleInfo, null, 2)}
        </pre>
      )}
      <button onClick={() => window.sessionStorage.clear()}>
        clear session
      </button>
    </div>
  );
}

export default HomePage;
