import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Input from "../../../components/inputs/text.input.component";
import Button from "../../../components/inputs/button.input.component";
import { useUser } from "../../../providers/user.provider";
import { SERVER_ENDPOINT } from "../../../config/globals";

interface CreateCircleStateProps {
  nextState: () => void;
  prevState: () => void;
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
        return;
      } else if (addUserToCircleResponse.status !== 200) {
        setCircleNameError("problem joining circle. try again");
        return;
      }
      setIsLoading(false);
      nextState();
    };

    if (newCircleName.length === 0) {
      setCircleNameError("circle name cannot be empty");
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
      setCircleNameError("problem creating circle. try again later.");
      return;
    }

    let newCircleCode;
    try {
      newCircleCode = await createNewCircleResponse.json();
    } catch (error) {
      setCircleNameError("problem creating circle. try again later.");
    }
    addUserToCircle(newCircleCode);

    console.log(`creating new circle ${newCircleName} for user ${email}`);
  };

  useEffect(() => {
    setCircleNameError(undefined);
    if (newCircleName === "") {
      return;
    }
    if (newCircleName.includes(" ")) {
      setCircleNameError("name cannot contain spaces.");
      return;
    }
    const invalidCodePattern = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
    if (invalidCodePattern.test(newCircleName)) {
      setCircleNameError("name cannot contain special characters.");
      return;
    }
  }, [newCircleName]);

  return (
    <div
      ref={ref}
      className="h-full w-full flex justify-center items-center flex-col gap-24"
    >
      <div className="flex flex-col">
        <h2 className="text-xl font-fancy self-start -mb-20 text-black/80">
          hey {username},
        </h2>
        <h1 className="text-2xl font-fancy text-black/80">Create Circle.</h1>
      </div>

      <div className="flex flex-col gap-8 items-center">
        {!!circleNameError ? (
          <p className="text-base -mt-12 -mb-8 self-start text-red-600/90">
            {circleNameError}
          </p>
        ) : (
          ""
        )}
        <Input
          onChange={(change: any) => setNewCircleName(change.target.value)}
          error={!!circleNameError}
          placeholder="Shelbyville"
          isLoading={isLoading}
          maxLength={16}
        >
          Circle Name:{" "}
        </Input>
        <Button
          isDisabled={isLoading || !!circleNameError}
          onClick={() => createNewCircle()}
        >
          Continue
        </Button>
        <button
          onClick={prevState}
          className="absolute bottom-[10%] text-black/90 text-base"
        >
          go back
        </button>
      </div>
    </div>
  );
});

const MotionCreateCircleState = motion(CreateCircleState, {
  forwardMotionProps: true,
});

export default MotionCreateCircleState;