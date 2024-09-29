import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserCircle } from "../models/userCircle.model";

interface UserCirclesContextType {
  userCircles: UserCircle[];
  setUserCircles: React.Dispatch<React.SetStateAction<UserCircle[]>>;
}

const UserCirclesContext = createContext<UserCirclesContextType | undefined>(
  undefined
);

export const useUserCircles = (): UserCirclesContextType => {
  const context = useContext(UserCirclesContext);
  if (!context) {
    throw new Error("useUserCircles must be used within a UserCirclesProvider");
  }
  return context;
};

interface UserCirclesProviderProps {
  children: ReactNode;
}

export const UserCirclesProvider: React.FC<UserCirclesProviderProps> = ({
  children,
}) => {
  const [userCircles, setUserCircles] = useState<UserCircle[]>([DefaultCircle]);

  return (
    <UserCirclesContext.Provider value={{ userCircles, setUserCircles }}>
      {children}
    </UserCirclesContext.Provider>
  );
};

const DefaultCircle: UserCircle = {
  circleCode: "",
  circleName: "",
};

export const isUserCirclesSet = (userCircles: UserCircle[]) => {
  if (
    userCircles.length === 1 &&
    userCircles[0].circleCode === "" &&
    userCircles[0].circleName === ""
  ) {
    return false;
  }
  return true;
};
