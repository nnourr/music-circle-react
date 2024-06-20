import React, { useState, useEffect, useCallback } from "react";
import Input from "../../../components/inputs/text.input.component";
import { useUser } from "../../../providers/user.provider";
import Button, {
  btnSizes,
} from "../../../components/inputs/button.input.component";
import { motion } from "framer-motion";
import { SERVER_ENDPOINT } from "../../../config/globals";

interface JoinCircleStateInterface {
  goToHome: (circleCode: string) => void;
  goToCreateCircle: () => void;
  initialCircleCode: string | null;
}

const JoinCircleState = React.forwardRef<
  HTMLDivElement,
  JoinCircleStateInterface
>(({ goToHome, goToCreateCircle, initialCircleCode }, ref) => {
  const [circleCode, setCircleCode] = useState<string>("");
  const [circleCodeError, setCircleCodeError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userId, username } = useUser();

  const addUserToCircle = useCallback(
    async (circleCode: string) => {
      setIsLoading(true);
      const addUserToCircleResponse = await fetch(
        `${SERVER_ENDPOINT}/user/${userId}/circle/${circleCode}`,
        { method: "post" }
      );
      if (addUserToCircleResponse.status === 404) {
        setCircleCodeError("circle not found");
        setIsLoading(false);
        return;
      } else if (addUserToCircleResponse.status !== 200) {
        setCircleCodeError("problem joining circle. try again later");
        setIsLoading(false);
        return;
      }

      goToHome(circleCode);
    },
    [userId, goToHome]
  );

  useEffect(() => {
    if (!!initialCircleCode) {
      addUserToCircle(initialCircleCode);
    }
  }, [addUserToCircle, initialCircleCode]);

  const handleSubmit = () => {
    if (circleCode.length !== 20) {
      setCircleCodeError("sorry, circle codes are 20 characters long");
    }
    if (!!!circleCodeError) {
      addUserToCircle(circleCode);
      setCircleCode("");
    }
  };

  useEffect(() => {
    setCircleCodeError(undefined);
    if (circleCode === "") {
      return;
    }
    if (circleCode.includes(" ")) {
      setCircleCodeError("sorry, no spaces.");
      return;
    }
    const invalidCodePattern = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
    if (invalidCodePattern.test(circleCode)) {
      setCircleCodeError("sorry, no special characters.");
      return;
    }
  }, [circleCode]);

  return (
    <div
      ref={ref}
      className="h-full w-full flex justify-center items-center flex-col gap-12 lg:gap-24"
    >
      <div className="flex flex-col">
        <h2 className="text-lg lg:text-lg-xl px-7 font-fancy self-start -mb-2 lg:-mb-8 text-black/80">
          hey {username},
        </h2>
        <h1 className="text-3xl lg:text-lg-3xl px-7 font-fancy text-black/80">
          Join Circle.
        </h1>
      </div>

      <div className="flex flex-col gap-4 items-center relative">
        {!!circleCodeError ? (
          <p className="text-base -translate-y-[70%] left-0 absolute lg:text-lg-base text-error">
            {circleCodeError}
          </p>
        ) : undefined}
        <Input
          onChange={(change: any) => setCircleCode(change.target.value)}
          error={!!circleCodeError}
          placeholder="enter circle code"
          isLoading={isLoading}
        >
          Circle Code:&nbsp;
        </Input>
        <Button
          title={`Join Circle with code ${circleCode}`}
          isDisabled={isLoading || !!circleCodeError}
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <div className="flex items-center flex-col">
          <p className="text-black/90 text-base lg:text-lg-base">
            don't have a circle code?
          </p>
          <Button
            title="Create New Circle"
            isDisabled={isLoading}
            onClick={goToCreateCircle}
            btnSize={btnSizes.md}
          >
            Create Circle
          </Button>
        </div>
      </div>
    </div>
  );
});

const MotionJoinCircleState = motion(JoinCircleState, {
  forwardMotionProps: true,
});

export default MotionJoinCircleState;
