import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Input from "../../../components/inputs/text.input.component";
import Button, {
  btnSizes,
} from "../../../components/inputs/button.input.component";
import { useUser } from "../../../providers/user.provider";
import { SERVER_ENDPOINT } from "../../../config/globals";
import { useUserCircles } from "../../../providers/userCircles.provider";

interface CreateCircleStateProps {
  goToHome: (circleCode: string) => any;
  goToJoinCircle: () => any;
}

const CreateCircleState = React.forwardRef<
  HTMLDivElement,
  CreateCircleStateProps
>(({ goToHome, goToJoinCircle }, ref) => {
  const [newCircleName, setNewCircleName] = useState<string>("");
  const [circleNameError, setCircleNameError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userId, username } = useUser();
  const { userCircles, setUserCircles } = useUserCircles();

  const createNewCircle = async () => {
    const addUserToCircle = async (circleCode: string) => {
      const addUserToCircleResponse = await fetch(
        `${SERVER_ENDPOINT}/user/${userId}/circle/${circleCode}`,
        { method: "post" }
      );
      if (addUserToCircleResponse.status === 404) {
        setCircleNameError("circle not found");
        setIsLoading(false);
        return;
      } else if (addUserToCircleResponse.status !== 200) {
        setCircleNameError("problem joining circle. try again");
        setIsLoading(false);
        return;
      }
      setUserCircles([
        ...userCircles,
        { circleName: newCircleName, circleCode: newCircleCode },
      ]);
      goToHome(newCircleCode);
    };

    if (newCircleName.length === 0) {
      setCircleNameError("circle name cannot be empty");
      setIsLoading(false);
      return;
    }

    if (!!circleNameError) {
      return;
    }

    setIsLoading(true);
    const createNewCircleResponse = await fetch(
      `${SERVER_ENDPOINT}/circle/${newCircleName}`,
      { method: "post" }
    );
    if (createNewCircleResponse.status !== 200) {
      setIsLoading(false);
      setCircleNameError("problem creating circle. try again later.");
      return;
    }

    let newCircleCode: string;
    try {
      newCircleCode = await createNewCircleResponse.json();
    } catch (error) {
      setIsLoading(false);
      setCircleNameError("problem creating circle. try again later.");
      return;
    }
    addUserToCircle(newCircleCode);
  };

  useEffect(() => {
    setCircleNameError(undefined);
    const trimmedCircleCode = newCircleName.trim();
    if (trimmedCircleCode === "") {
      return;
    }
    const invalidCodePattern = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~0-9]/;
    if (invalidCodePattern.test(trimmedCircleCode)) {
      setCircleNameError("sorry, no special characters.");
      return;
    }
  }, [newCircleName]);

  const isFirstTime = localStorage.getItem("firstTime") === "true";
  return (
    <div
      ref={ref}
      className="h-full w-full flex justify-center items-center flex-col gap-8 lg:gap-24"
    >
      <div className="flex flex-col w-min">
        <h2 className="text-lg lg:text-lg-xl font-fancy self-start lg:px-7 -mb-2 lg:-mb-8 text-black/80">
          hey {username},
        </h2>
        <h1 className="text-3xl lg:text-lg-3xl lg:text-nowrap font-fancy text-black/80">
          Create Circle.
        </h1>
        {isFirstTime && (
          <p className="mx-3 lg:my-3 text-sm lg:text-base lg:text-right font-sans leading-none text-black/80">
            (a circle is a group where you can see each other's music taste)
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 items-center relative">
        {!!circleNameError && (
          <p className="text-base -translate-y-[70%] left-0 absolute lg:text-lg-base text-error">
            {circleNameError}
          </p>
        )}
        <Input
          onChange={(change: any) => setNewCircleName(change.target.value)}
          error={!!circleNameError}
          placeholder="enter circle name"
          isLoading={isLoading}
          maxLength={16}
        >
          Circle Name:&nbsp;
        </Input>
        <Button
          title={`Create new Circle with name ${newCircleName}`}
          isDisabled={isLoading || !!circleNameError}
          onClick={() => createNewCircle()}
        >
          Submit
        </Button>
        <div className="mt-4 flex flex-col items-center">
          <p className="text-base lg:text-lg-base text-black/80 text-center">
            want to join an existing circle?
          </p>
          <Button
            title="Create New Circle"
            isDisabled={isLoading}
            onClick={() => goToJoinCircle()}
            btnSize={btnSizes.md}
          >
            Join Circle
          </Button>
        </div>
      </div>
    </div>
  );
});

const MotionCreateCircleState = motion(CreateCircleState, {
  forwardMotionProps: true,
});

export default MotionCreateCircleState;
