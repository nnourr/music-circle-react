import { useEffect, useState } from "react";
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
  const { email, username, setEmail, setUsername } = useUser();
  const { userCircles, setUserCircles } = useUserCircles();
  const [pageError, setPageError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [params] = useSearchParams();
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

  const navigateToHome = (circleCode?: string) => {
    const searchParamsObject = {
      noAnimation: params.get("noRedirect") || "false",
      circleCode: circleCode || "",
    };
    const navigateObject = {
      pathname: "/home",
      search: createSearchParams(searchParamsObject).toString(),
    };
    navigate(navigateObject);
  };

  useEffect(() => {
    const getUserCircles = async (email: string) => {
      try {
        const getUserCirclesResponse = await fetch(
          `${SERVER_ENDPOINT}/user/${email}/circles`
        );
        if (getUserCirclesResponse.status === 200) {
          const circles = (await getUserCirclesResponse.json()) as UserCircle[];

          if (circles.length > 0) {
            setUserCircles(circles);

            if (
              params.get("noRedirect") !== "true" &&
              !!params.get("circleCode")
            ) {
              navigate("/home");
            }
          }
        } else {
          throw new Error("get user circles response not 200");
        }
      } catch (error) {
        console.error("Error getting circles " + error);
      }
    };
    if (!!!email) {
      return;
    } else {
      getUserCircles(email);
    }
  }, [email, navigate, params, setUserCircles]);

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
          const email = userObj.email;
          const username = userObj.username;
          if (!!!email || !!!username) {
            throw new Error("email or username not found in response");
          }
          setEmail(email);
          setUsername(userObj.username);
          navigate("/joinCircle");
        } else {
          throw new Error("setUser response not 200");
        }
      } catch (error) {
        setPageError("Problem Signing In.");
        console.error("Problem signing user into service " + error);
      }
      setIsLoading(false);
    };
    const queryParams = new URLSearchParams(window.location.search);

    const loginCode = queryParams.get("code");
    const error = queryParams.get("error");

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
  }, [setEmail, setUsername, email, navigate]);

  useEffect(() => {
    if (
      !!email &&
      !!username &&
      !!userCircles.length &&
      params.get("noRedirect") !== "true" &&
      !!params.get("circleCode")
    ) {
      navigate("/home");
    }
  }, [email, navigate, params, userCircles.length, username]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const circleCodeParam = queryParams.get("circleCode");
    if (!!!circleCodeParam) {
      return;
    }
    console.log("hey mamas");

    localStorage.setItem("initialCircleCode", circleCodeParam);
  }, [params]);

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
            path="/joinCircle"
            element={
              <MotionJoinCircleState
                key={"MotionJoinCircleState"}
                nextState={navigateToHome}
                goToCreateCircle={() => {
                  navigate({
                    pathname: "/createCircle",
                    search: createSearchParams(params).toString(),
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
            path="/createCircle"
            element={
              <MotionCreateCircleState
                key={"MotionCreateCircleState"}
                goToHome={navigateToHome}
                prevState={() => {
                  navigate({
                    pathname: "/joinCircle",
                    search: createSearchParams(params).toString(),
                  });
                }}
                variants={landingPageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              />
            }
          />
        </Routes>
      )}
      {params.get("noRedirect") === "true" ? (
        <Button
          onClick={navigateToHome}
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
