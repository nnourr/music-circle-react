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
  const [userCircles, setUserCircles] = useState<UserCircle[]>([]);

  return (
    <UserCirclesContext.Provider value={{ userCircles, setUserCircles }}>
      {children}
    </UserCirclesContext.Provider>
  );
};
