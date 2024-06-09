import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserCirclesContextType {
  circles: string[];
  setCircles: React.Dispatch<React.SetStateAction<string[]>>;
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
  const [circles, setCircles] = useState<string[]>([]);

  return (
    <UserCirclesContext.Provider value={{ circles, setCircles }}>
      {children}
    </UserCirclesContext.Provider>
  );
};
