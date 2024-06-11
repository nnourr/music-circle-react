import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import MotionEnterAnimation from "./states/enterAnimation.state";
import { NavbarComponent } from "./components/navbar.component";
import { CircleShowcaseComponent } from "./components/circleShowcase.component";
import { useUserCircles } from "../../providers/userCircles.provider";
import { CircleInfo } from "./models/circleInfo.model";
import { SERVER_ENDPOINT } from "../../config/globals";
import Button from "../../components/inputs/button.input.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../providers/user.provider";
import { UserCircle } from "../../models/userCircle.model";
import { useNavigate } from "react-router-dom";

const HomePage = React.forwardRef<HTMLDivElement>((_, ref) => {
  const [isEntering, setIsEntering] = useState<boolean>(true);
  const [currentCircle, setCurrentCircle] = useState<CircleInfo | undefined>();
  const { userCircles, setUserCircles } = useUserCircles();
  const [pageError, setPageError] = useState<string | undefined>();
  const { email } = useUser();
  const navigate = useNavigate();

  setTimeout(() => {
    setIsEntering(false);
  }, 4700);

  useEffect(() => {
    const getFirstCircle = async () => {
      try {
        const getFirstCircleResponse = await fetch(
          `${SERVER_ENDPOINT}/circle/${userCircles[0].circleCode}`
        );
        if (getFirstCircleResponse.status === 200) {
          const firstCircle =
            (await getFirstCircleResponse.json()) as CircleInfo;
          setCurrentCircle(firstCircle);
        } else {
          throw new Error("get circle info response not 200");
        }
      } catch (error) {
        setPageError("Error getting circle " + currentCircle?.circleName);
        console.error("Error getting circle " + currentCircle);
      }
    };

    const getUserCircles = async (email: string) => {
      try {
        const getUserCirclesResponse = await fetch(
          `${SERVER_ENDPOINT}/user/${email}/circles`
        );
        if (getUserCirclesResponse.status === 200) {
          const circles = (await getUserCirclesResponse.json()) as UserCircle[];
          setUserCircles(circles);
        } else {
          throw new Error("get user circles response not 200");
        }
      } catch (error) {
        console.error("Error getting circles " + error);
      }
    };
    if (!!!email) {
      navigate("/");
      return;
    }
    if (userCircles.length === 0) {
      getUserCircles(email);
    } else if (!!!currentCircle) {
      getFirstCircle();
    }
  }, [currentCircle, email, navigate, setUserCircles, userCircles]);

  return (
    <div ref={ref} className="h-full w-full">
      {isEntering ? (
        <div className="h-full w-full flex items-center justify-center">
          <MotionEnterAnimation />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full w-full overflow-auto"
        >
          <NavbarComponent menuClicked={() => console.log("menu clicked")} />
          {!!currentCircle || !!!pageError ? (
            <CircleShowcaseComponent circleInfo={currentCircle} />
          ) : (
            <div className="w-4/5 flex items-center justify-center text-lg lg:text-lg-xl text-error m-auto flex-col">
              <div>
                <FontAwesomeIcon icon={faWarning} className="lg:mr-4" />{" "}
                {pageError}
              </div>
              <Button
                onClick={() =>
                  (window.location.href = window.location.pathname)
                }
                white={true}
              >
                Try Again
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
});

const MotionHomePage = motion(HomePage, {
  forwardMotionProps: true,
});

export default MotionHomePage;
