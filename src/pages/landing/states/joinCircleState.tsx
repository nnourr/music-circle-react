import React, { useState, useEffect } from "react";
import Input from "../../../components/inputs/text.input.component";
import { useUser } from "../../../providers/user.provider";
import Button from "../../../components/inputs/button.input.component";

interface JoinCircleStateInterface {
  nextState: () => void;
  goToCreateCircle: () => void;
}

export const JoinCircleState: React.FC<JoinCircleStateInterface> = ({
  goToCreateCircle,
}) => {
  const [circleCode, setCircleCode] = useState<string>("");
  const { email, username } = useUser();

  useEffect(() => {
    console.log("JoinCircleState - email:", email);
    console.log("JoinCircleState - username:", username);
  }, [email, username]);

  return (
    <div className="h-full w-full flex justify-center items-center flex-col gap-24">
      <div className="flex flex-col">
        <h2 className="text-xl font-fancy self-start -mb-20 text-black/80">
          hey {username},
        </h2>
        <h1 className="text-2xl font-fancy text-black/80">Join Circle.</h1>
      </div>

      <div className="flex flex-col items-center">
        <Input onChange={(change: any) => setCircleCode(change.target.value)}>
          Circle Code:{" "}
        </Input>
        <p className="text-base text-black/80">or,</p>
        <Button onClick={() => goToCreateCircle()}>Create New Circle</Button>
      </div>
    </div>
  );
};
