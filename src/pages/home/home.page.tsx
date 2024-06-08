import { motion } from "framer-motion";
import React from "react";
import { useUser } from "../../providers/user.provider";
import {
  LINEAR_GRADIENT_BREATHE_1,
  LINEAR_GRADIENT_BREATHE_2,
} from "../../config/globals";
import MotionEnterAnimation from "./states/enterAnimation.state";

const HomePage = React.forwardRef<HTMLDivElement>((_, ref) => {
  const { username } = useUser();
  return <MotionEnterAnimation />;
});

const MotionHomePage = motion(HomePage, {
  forwardMotionProps: true,
});

export default MotionHomePage;
