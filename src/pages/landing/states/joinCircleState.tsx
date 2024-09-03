import React, { useState, useEffect, useCallback } from "react";
import Input from "../../../components/inputs/text.input.component";
import { useUser } from "../../../providers/user.provider";
import Button, {
  btnSizes,
} from "../../../components/inputs/button.input.component";
import { motion } from "framer-motion";
import { SERVER_ENDPOINT } from "../../../config/globals";
import { ModalComponent } from "../../../components/modal.component";

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
  const [circleName, setCircleName] = useState<string | undefined>(undefined);
  const [circleCodeError, setCircleCodeError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showJoinCircleModal, setShowJoinCircleModal] =
    useState<boolean>(false);
  const { userId, username } = useUser();

  const isFirstTime = localStorage.getItem("firstTime") === "true";

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

  const getCircleName = async (
    circleCode: string
  ): Promise<string | undefined> => {
    setIsLoading(true);
    const getCircleNameResponse = await fetch(
      `${SERVER_ENDPOINT}/circle/${circleCode}/name`
    );
    if (getCircleNameResponse.status === 404) {
      setCircleCodeError("circle not found");
      setIsLoading(false);
      return;
    } else if (getCircleNameResponse.status !== 200) {
      setCircleCodeError("problem joining circle. try again later");
      setIsLoading(false);
      return;
    }
    const json = await getCircleNameResponse.json();
    setCircleName(json.circleName);
    return json;
  };

  useEffect(() => {
    if (!!initialCircleCode) {
      getCircleName(initialCircleCode);
      setCircleCode(initialCircleCode);
      setShowJoinCircleModal(true);
    }
  }, [addUserToCircle, initialCircleCode]);

  const handleSubmit = async () => {
    const trimmedCircleCode = circleCode.trim();

    if (trimmedCircleCode.length !== 20) {
      setCircleCodeError("sorry, circle codes are 20 characters long");
      return;
    }
    const circleName = await getCircleName(circleCode);
    if (!!!circleCodeError && circleName) {
      setShowJoinCircleModal(true);
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
      className="h-full w-full flex justify-center items-center flex-col gap-8 lg:gap-24 p-7"
    >
      {showJoinCircleModal && (
        <ModalComponent
          cancelAction={{
            actionText: "don't join",
            actionTitle: "I don't want to join this circle",
            onAction: () => {
              setShowJoinCircleModal(false);
              setIsLoading(false);
            },
          }}
          confirmAction={{
            actionText: "join",
            actionTitle: "I want to join this circle",
            onAction: () => {
              addUserToCircle(circleCode);
            },
          }}
          promptText={`Are you sure you want to join ${circleName}?`}
          onClose={() => setShowJoinCircleModal(false)}
        />
      )}
      <div className="flex flex-col">
        <h2 className="text-lg lg:text-lg-xl lg:px-7 font-fancy self-start -mb-2 lg:-mb-8 text-black/80">
          hey {username},
        </h2>
        <h1 className="text-3xl lg:text-lg-3xl lg:text-nowrap font-fancy text-black/80">
          Join Circle.
        </h1>
        {isFirstTime && (
          <p className="mx-3 lg:my-3 text-sm lg:text-base lg:text-right font-sans leading-none text-black/80">
            (circle codes are auto-generated and 20 letters long)
          </p>
        )}
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
