import { useCallback, useEffect, useState } from "react";
import { BackgroundGradient } from "./components/background-gradient.component";
import React from "react";
import queryString from "query-string";
import {
  SERVER_ENDPOINT,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
} from "../../config/globals";
import { useUser } from "../../providers/user.provider";
import { motion } from "framer-motion";
import MotionSpotifyLoginState from "./states/spotifylogin.state";
import { userLoginInterface } from "./models/userLogin.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import Button, {
  btnSizes,
} from "../../components/inputs/button.input.component";
import MotionJoinCircleState from "./states/joinCircleState";
import MotionCreateCircleState from "./states/createCircleState";
import {
  Route,
  Routes,
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useUserCircles } from "../../providers/userCircles.provider";
import { UserCircle } from "../../models/userCircle.model";

const landingPageVariants = {
  hidden: { opacity: 0, translateY: "10%" },
  visible: { opacity: 1, translateY: 0 },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const errorVariants = {
  exit: { scale: 0 },
};

const LandingPage = React.forwardRef<HTMLDivElement>((_, ref) => {
  const { userId, username, setUserId, setUsername } = useUser();
  const { userCircles, setUserCircles } = useUserCircles();
  const [pageError, setPageError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hashParams] = useSearchParams(); // for hash params
  const urlParams = new URLSearchParams(window.location.search);
  const loginCode = urlParams.get("code");
  const error = urlParams.get("error");
  const noRedirect = hashParams.get("noRedirect");
  const initialCircleCodeParam =
    urlParams.get("circleCode") || hashParams.get("circleCode");
  const initialCircleCodeStorage = localStorage.getItem("initialCircleCode");
  const navigate = useNavigate();

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

  const navigateToHome = useCallback(
    (circleCode?: string) => {
      const searchParamsObject = {
        noAnimation: noRedirect || "false",
        circleCode: circleCode || "",
      };
      const navigateObject = {
        pathname: "/home",
        search: createSearchParams(searchParamsObject).toString(),
      };
      navigate(navigateObject);
    },
    [navigate, noRedirect]
  );

  // useEffect(() => {
  //   const getUserCircles = async (userId: string) => {
  //     try {
  //       const getUserCirclesResponse = await fetch(
  //         `${SERVER_ENDPOINT}/user/${userId}/circles`
  //       );
  //       if (getUserCirclesResponse.status === 200) {
  //         const circles = (await getUserCirclesResponse.json()) as UserCircle[];

  //         if (circles.length > 0) {
  //           setUserCircles(circles);

  //           if (
  //             noRedirect !== "true" &&
  //             !!!initialCircleCodeStorage &&
  //             !!!initialCircleCodeParam
  //           ) {
  //             navigate("/home");
  //           }
  //         }
  //       } else {
  //         throw new Error("get user circles response not 200");
  //       }
  //     } catch (error) {
  //       console.error("Error getting circles " + error);
  //     }
  //   };
  //   if (!!!userId || userCircles.length !== 0) {
  //     return;
  //   } else {
  //     getUserCircles(userId);
  //   }
  // }, [
  //   userId,
  //   initialCircleCodeParam,
  //   initialCircleCodeStorage,
  //   navigate,
  //   noRedirect,
  //   setUserCircles,
  //   userCircles.length,
  // ]);

  useEffect(() => {
    const handleUserLogin = async (loginCode: string) => {
      setIsLoading(true);
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
          const userId = userObj.userId;
          const username = userObj.username;
          if (!!!userId || !!!username) {
            throw new Error("userId or username not found in response");
          }
          setUserId(userId);
          setUsername(userObj.username);
          navigate("/createCircle");
        } else {
          throw new Error("setUser response not 200");
        }
      } catch (error) {
        setPageError("Problem Signing In.");
        console.error("Problem signing user into service " + error);
      }
      setIsLoading(false);
    };

    if (error !== null) {
      console.error(error);
      setPageError("sorry, you need to allow us access to continue");
      return;
    }

    if (loginCode === null) {
      return;
    }
    window.history.replaceState({}, document.title, "/");
    handleUserLogin(loginCode);
  }, [setUserId, setUsername, userId, navigate, error, loginCode]);

  // useEffect(() => {
  //   if (
  //     !!userId &&
  //     !!username &&
  //     !!userCircles.length &&
  //     noRedirect !== "true" &&
  //     !!!initialCircleCodeStorage &&
  //     !!!initialCircleCodeParam
  //   ) {
  //     navigate("/home");
  //   }
  // }, [
  //   userId,
  //   initialCircleCodeParam,
  //   initialCircleCodeStorage,
  //   navigate,
  //   noRedirect,
  //   userCircles.length,
  //   username,
  // ]);

  useEffect(() => {
    if (!!!initialCircleCodeParam) {
      return;
    }

    localStorage.setItem("initialCircleCode", initialCircleCodeParam);
  }, [initialCircleCodeParam]);

  return (
    <motion.div
      ref={ref}
      className="h-full w-full overflow-hidden"
      variants={errorVariants}
    >
      {!!pageError ? (
        <div className=" w-4/5 h-full flex items-center justify-center text-lg lg:text-lg-xl text-error m-auto flex-col">
          <div>
            <FontAwesomeIcon icon={faWarning} className="lg:mr-4" /> {pageError}
          </div>
          <Button
            title="Try Again"
            onClick={() => (window.location.href = window.location.pathname)}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <MotionSpotifyLoginState
                key={"MotionSpotifyLoginState"}
                nextState={startLoginFlow}
                variants={landingPageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                isLoading={isLoading}
              />
            }
          />
          <Route
            path="/createCircle"
            element={
              <MotionCreateCircleState
                key={"MotionCreateCircleState"}
                goToHome={navigateToHome}
                goToJoinCircle={() => {
                  navigate({
                    pathname: "/joinCircle",
                    search: createSearchParams(hashParams).toString(),
                  });
                }}
                variants={landingPageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              />
            }
          />
          <Route
            path="/joinCircle"
            element={
              <MotionJoinCircleState
                key={"MotionJoinCircleState"}
                goToHome={navigateToHome}
                goToCreateCircle={() => {
                  navigate({
                    pathname: "/createCircle",
                    search: createSearchParams(hashParams).toString(),
                  });
                }}
                variants={landingPageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                initialCircleCode={initialCircleCodeStorage}
              />
            }
          />
        </Routes>
      )}
      {noRedirect === "true" ? (
        <Button
          title="Go Back Home"
          onClick={() => navigateToHome()}
          className="!absolute top-[5%] left-6 lg:top-8 lg:left-16 z-20"
          btnSize={btnSizes.md}
        >
          go home
        </Button>
      ) : (
        ""
      )}
      <BackgroundGradient error={!!pageError} />
    </motion.div>
  );
});

export const MotionLandingPage = motion(LandingPage, {
  forwardMotionProps: true,
});

export default MotionLandingPage;
