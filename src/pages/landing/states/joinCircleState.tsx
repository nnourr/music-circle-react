import React, { useState, useEffect } from "react";
import Input from "../../../components/inputs/text.input.component";
import { useUser } from "../../../providers/user.provider";
import Button from "../../../components/inputs/button.input.component";
import { motion } from "framer-motion";
import { SERVER_ENDPOINT } from "../../../config/globals";

interface JoinCircleStateInterface {
  nextState: () => void;
  goToCreateCircle: () => void;
}

const JoinCircleState = React.forwardRef<
  HTMLDivElement,
  JoinCircleStateInterface
>(({ nextState, goToCreateCircle }, ref) => {
  const [circleCode, setCircleCode] = useState<string>("");
  const [circleCodeError, setCircleCodeError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { email, username } = useUser();

  useEffect(() => {
    const addUserToCircle = async () => {
      setIsLoading(true);
      const addUserToCircleResponse = await fetch(
        `${SERVER_ENDPOINT}/user/${email}/circle/${circleCode}`,
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

      nextState();
    };
    if (circleCode.length === 20 && !!!circleCodeError) {
      // this runs a trillion times
      addUserToCircle();
    }
  }, [circleCode, circleCodeError, email, nextState]);

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

      <div className="flex flex-col items-center relative">
        {!!circleCodeError ? (
          <p className="text-base -translate-y-[70%] left-0 absolute lg:text-lg-base text-error">
            {circleCodeError}
          </p>
        ) : undefined}
        <Input
          onChange={(change: any) => setCircleCode(change.target.value)}
          error={!!circleCodeError}
          placeholder="examplecode"
          isLoading={isLoading}
        >
          Circle Code:&nbsp;
        </Input>
        <p className="text-base lg:text-lg-base text-black/80 text-center">
          or,
        </p>
        <Button isDisabled={isLoading} onClick={() => goToCreateCircle()}>
          Create New Circle
        </Button>
      </div>
    </div>
  );
});

const MotionJoinCircleState = motion(JoinCircleState, {
  forwardMotionProps: true,
});

export default MotionJoinCircleState;
