import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Input from "../../../components/inputs/text.input.component";
import Button from "../../../components/inputs/button.input.component";
import { useUser } from "../../../providers/user.provider";
import { SERVER_ENDPOINT } from "../../../config/globals";

interface CreateCircleStateProps {
  nextState: () => any;
  prevState: () => any;
}

// Forward ref to the DOM element you want to animate
const CreateCircleState = React.forwardRef<
  HTMLDivElement,
  CreateCircleStateProps
>(({ nextState, prevState }, ref) => {
  const [newCircleName, setNewCircleName] = useState<string>("");
  const [circleNameError, setCircleNameError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { email, username } = useUser();

  const createNewCircle = async () => {
    const addUserToCircle = async (circleCode: string) => {
      const addUserToCircleResponse = await fetch(
        `${SERVER_ENDPOINT}/user/${email}/circle/${circleCode}`,
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
      nextState();
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

    let newCircleCode;
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
    if (newCircleName === "") {
      return;
    }
    if (newCircleName.includes(" ")) {
      setCircleNameError("sorry, no spaces.");
      return;
    }
    const invalidCodePattern = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
    if (invalidCodePattern.test(newCircleName)) {
      setCircleNameError("sorry, no special characters.");
      return;
    }
  }, [newCircleName]);

  return (
    <div
      ref={ref}
      className="h-full w-full flex justify-center items-center flex-col gap-12 lg:gap-24"
    >
      <div className="flex flex-col">
        <h2 className="text-lg lg:text-lg-xl px-7 font-fancy self-start -mb-2 lg:-mb-8 text-black/80">
          hey {username},
        </h2>
        <h1 className="text-2xl lg:text-lg-2xl px-7 font-fancy text-black/80">
          Create Circle.
        </h1>
      </div>

      <div className="flex flex-col gap-4 items-center relative">
        {!!circleNameError ? (
          <p className="text-base -translate-y-[70%] left-0 absolute lg:text-lg-base text-error">
            {circleNameError}
          </p>
        ) : undefined}
        <Input
          onChange={(change: any) => setNewCircleName(change.target.value)}
          error={!!circleNameError}
          placeholder="Shelbyville"
          isLoading={isLoading}
          maxLength={16}
        >
          Circle Name:&nbsp;
        </Input>
        <Button
          isDisabled={isLoading || !!circleNameError}
          onClick={() => createNewCircle()}
        >
          Continue
        </Button>
      </div>
      <button
        onClick={prevState}
        className="absolute bottom-[10%] text-black/90 text-base lg:text-lg-base"
      >
        go back
      </button>
    </div>
  );
});

const MotionCreateCircleState = motion(CreateCircleState, {
  forwardMotionProps: true,
});

export default MotionCreateCircleState;
