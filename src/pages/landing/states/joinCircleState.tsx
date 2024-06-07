import React, { useState, useEffect } from "react";
import Input from "../../../components/inputs/text.input.component";
import { useUser } from "../../../providers/user.provider";
import Button from "../../../components/inputs/button.input.component";
import { motion } from "framer-motion";

interface JoinCircleStateInterface {
  nextState: () => void;
  goToCreateCircle: () => void;
}

const JoinCircleState = React.forwardRef<
  HTMLDivElement,
  JoinCircleStateInterface
>(({ goToCreateCircle }, ref) => {
  const [circleCode, setCircleCode] = useState<string>("");
  const [circleCodeError, setCircleCodeError] = useState<string | undefined>();
  const { email, username } = useUser();

  useEffect(() => {
    setCircleCodeError(undefined);
    if (circleCode === "") {
      return;
    }
    if (circleCode.includes(" ")) {
      setCircleCodeError("code cannot contain spaces.");
      return;
    }
    const invalidCodePattern = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (invalidCodePattern.test(circleCode)) {
      setCircleCodeError("code cannot contain special characters.");
      return;
    }
    if (circleCode.length === 16 && !!!circleCodeError) {
      console.log(`add ${email} to circle`);
    }
  }, [circleCode, circleCodeError, email]);

  return (
    <div
      ref={ref}
      className="h-full w-full flex justify-center items-center flex-col gap-24"
    >
      <div className="flex flex-col">
        <h2 className="text-xl font-fancy self-start -mb-20 text-black/80">
          hey {username},
        </h2>
        <h1 className="text-2xl font-fancy text-black/80">Join Circle.</h1>
      </div>

      <div className="flex flex-col items-center">
        {!!circleCodeError ? (
          <p className="text-base -mt-12 self-start text-red-600/80">
            {circleCodeError}
          </p>
        ) : (
          ""
        )}
        <Input
          onChange={(change: any) => setCircleCode(change.target.value)}
          error={!!circleCodeError}
        >
          Circle Code:{" "}
        </Input>
        <p className="text-base text-black/80">or,</p>
        <Button onClick={() => goToCreateCircle()}>Create New Circle</Button>
      </div>
    </div>
  );
});

const MotionJoinCircleState = motion(JoinCircleState, {
  forwardMotionProps: true,
});

export default MotionJoinCircleState;
