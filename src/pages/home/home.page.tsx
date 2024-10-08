import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import MotionHomeState from "./states/home.state";
import { NavbarComponent } from "./components/navbar.component";
import { CircleShowcaseState } from "./states/circleShowcase.state";
import {
  isUserCirclesSet,
  useUserCircles,
} from "../../providers/userCircles.provider";
import { CircleInfo } from "./models/circleInfo.model";
import { SERVER_ENDPOINT } from "../../config/globals";
import Button from "../../components/inputs/button.input.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faWarning } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../providers/user.provider";
import { UserCircle } from "../../models/userCircle.model";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { HamburgerMenu } from "./components/hamburgerMenu.component";
import { Footer } from "../../components/footer.component";

const HomePage = React.forwardRef<HTMLDivElement>((_, ref) => {
  const [currentCircleInfo, setCurrentCircleInfo] = useState<
    CircleInfo | undefined
  >();
  const { userCircles, setUserCircles } = useUserCircles();
  const [pageError, setPageError] = useState<string | undefined>();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userId } = useUser();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  window.localStorage.removeItem("initialCircleCode");

  const setCurrentCircle = useCallback(async (circleCode: string) => {
    setIsLoading(true);
    try {
      const getCircleResponse = await fetch(
        `${SERVER_ENDPOINT}/circle/${circleCode}`
      );
      if (getCircleResponse.status === 200) {
        const firstCircle = (await getCircleResponse.json()) as CircleInfo;
        setCurrentCircleInfo(firstCircle);
      } else {
        throw new Error("get circle info response not 200");
      }
    } catch (error) {
      setPageError("Error getting circle ");
      console.error("Error getting circle " + circleCode);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!!currentCircleInfo) {
      return;
    }
    if (!!!userId) {
      navigate("/");
    }

    if (!!!userCircles || userCircles.length === 0) {
      return;
    }

    if (userCircles.length === 1 && isUserCirclesSet(userCircles)) {
      navigate({
        pathname: "/home",
        search: createSearchParams({
          circleCode: userCircles[0].circleCode,
        }).toString(),
      });
    }
  }, [currentCircleInfo, userId, navigate, setCurrentCircle, userCircles]);

  useEffect(() => {
    const paramCircleCode = params.get("circleCode");

    if (
      !!paramCircleCode &&
      userCircles.filter((circle) => circle.circleCode === paramCircleCode)
        .length !== 0
    ) {
      setCurrentCircle(paramCircleCode);
      return;
    }
    setCurrentCircleInfo(undefined);
  }, [params, setCurrentCircle, userCircles]);

  useEffect(() => {
    const getUserCircles = async (userId: string) => {
      setIsLoading(true);
      try {
        const getUserCirclesResponse = await fetch(
          `${SERVER_ENDPOINT}/user/${userId}/circles`
        );
        if (getUserCirclesResponse.status === 200) {
          const circles = (await getUserCirclesResponse.json()) as UserCircle[];
          setUserCircles(circles);
          if (circles.length === 0) {
            navigate("/createCircle");
          }
        } else {
          throw new Error("get user circles response not 200");
        }
      } catch (error) {
        console.error("Error getting circles " + error);
      }
      setIsLoading(false);
    };
    if (!!!userId) {
      navigate("/");
      return;
    }
    if (!isUserCirclesSet(userCircles)) {
      getUserCircles(userId);
    }
  }, [userId, navigate, setUserCircles]);

  return (
    <div ref={ref} className="h-full w-full flex flex-col">
      {!!!pageError ? (
        !!currentCircleInfo ? (
          <>
            <NavbarComponent menuClicked={() => setShowMenu(true)} />
            <CircleShowcaseState
              circleInfo={currentCircleInfo}
              isLoading={isLoading}
            />
          </>
        ) : isLoading ? (
          <div className="h-full w-full flex justify-center items-center">
            {" "}
            <FontAwesomeIcon
              icon={faSpinner}
              spinPulse
              className="text-2xl lg:text-lg-2xl text-white"
            />
          </div>
        ) : (
          <div className="overflow-y-auto h-full">
            <MotionHomeState />
            <Footer />
          </div>
        )
      ) : (
        <div className="w-4/5 flex items-center justify-center text-lg lg:text-lg-xl text-error m-auto flex-col">
          <div>
            <FontAwesomeIcon icon={faWarning} className="lg:mr-4" /> {pageError}
          </div>
          <Button
            title="Try Again"
            onClick={() => (window.location.href = window.location.pathname)}
            white={true}
          >
            Try Again
          </Button>
        </div>
      )}
      <AnimatePresence>
        {showMenu ? (
          <HamburgerMenu
            close={() => setShowMenu(false)}
            currentCircleCode={currentCircleInfo?.circleCode}
            setCurrentCircle={setCurrentCircle}
          />
        ) : (
          ""
        )}
      </AnimatePresence>
    </div>
  );
});

const MotionHomePage = motion(HomePage, {
  forwardMotionProps: true,
});

export default MotionHomePage;
